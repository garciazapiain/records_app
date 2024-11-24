import express, { Request, Response } from "express";
import multer from "multer";
import pool from "./database";
import fs from "fs";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate unique filename
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb: (error: Error | null, acceptFile?: boolean) => void) => {
        const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // File type is valid, proceed
        } else {
            cb(new Error("Unsupported file type")); // File type is invalid, reject
        }
    },
});

// GET all records
router.get("/", async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query("SELECT * FROM records ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching records:", error);
        res.status(500).json({ error: "Failed to fetch records" });
    }
});

// GET a single record by ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM records WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: "Record not found" });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error("Error fetching record by ID:", error);
        res.status(500).json({ error: "Failed to fetch record" });
    }
});

// POST a new record with file upload optional
router.post("/", upload.array("files", 5), async (req: Request, res: Response): Promise<void> => {
    const { sender_name, sender_age, message } = req.body;

    // Basic validation
    if (!sender_name || !sender_age || !message) {
        res.status(400).json({ error: "Sender's name, age, and message are required." });
        return;
    }

    // Process uploaded files
    const filePaths = req.files ? (req.files as Express.Multer.File[]).map((file) => file.filename) : [];

    try {
        // Save record to the database
        const result = await pool.query(
            "INSERT INTO records (sender_name, sender_age, message, file_paths) VALUES ($1, $2, $3, $4) RETURNING *",
            [sender_name, sender_age, message, JSON.stringify(filePaths)] // Save file paths as a JSON string
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating record:", error);

        // Cleanup uploaded files on error
        filePaths.forEach((file) => {
            const fullPath = path.join(__dirname, "..", "uploads", file);
            fs.unlink(fullPath, (err) => {
                if (err) console.error(`Failed to clean up file: ${file}`, err);
            });
        });

        res.status(500).json({ error: "Failed to create record." });
    }
});

// PUT (Update) a record
router.put("/:id", upload.array("files", 5), async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const { sender_name, sender_age, message } = req.body;

    // Declare newFiles inside the try block to avoid scope issues
    try {
        // Extract new files from the request
        const newFiles = req.files ? (req.files as Express.Multer.File[]).map((file) => file.filename) : [];

        // Fetch the existing record to get current file paths
        const recordResult = await pool.query("SELECT file_paths FROM records WHERE id = $1", [id]);
        if (recordResult.rows.length === 0) {
            res.status(404).json({ error: "Record not found" });
            return;
        }

        // Merge existing files with the new files
        const existingFiles = recordResult.rows[0]?.file_paths || [];
        const updatedFiles = [...existingFiles, ...newFiles];

        // Prepare fields and values for the update query
        const fields = [];
        const values: (string | number | null)[] = [];
        let valueIndex = 1;

        if (sender_name) {
            fields.push(`sender_name = $${valueIndex++}`);
            values.push(sender_name);
        }
        if (sender_age !== undefined) {
            fields.push(`sender_age = $${valueIndex++}`);
            values.push(sender_age);
        }
        if (message) {
            fields.push(`message = $${valueIndex++}`);
            values.push(message);
        }

        fields.push(`file_paths = $${valueIndex++}`);
        values.push(JSON.stringify(updatedFiles));
        values.push(id);

        // Update the record in the database
        const query = `UPDATE records SET ${fields.join(", ")} WHERE id = $${valueIndex} RETURNING *`;
        const result = await pool.query(query, values);

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating record:", error);

        // Ensure uploaded files are cleaned up if an error occurs
        const newFiles = req.files ? (req.files as Express.Multer.File[]).map((file) => file.filename) : [];
        newFiles.forEach((file) => {
            const fullPath = path.join(__dirname, "..", "uploads", file);
            fs.unlink(fullPath, (err) => {
                if (err) console.error(`Failed to clean up file: ${file}`, err);
            });
        });

        res.status(500).json({ error: "Failed to update record." });
    }
});

// DELETE a record file
router.delete("/:id/files", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const { file } = req.body;

    try {
        const recordResult = await pool.query("SELECT file_paths FROM records WHERE id = $1", [id]);
        const existingFiles = recordResult.rows[0]?.file_paths || [];

        if (!existingFiles.includes(file)) {
            res.status(404).json({ error: "File not found in record." });
            return;
        }

        const updatedFiles = existingFiles.filter((f: string) => f !== file);
        await pool.query("UPDATE records SET file_paths = $1 WHERE id = $2", [JSON.stringify(updatedFiles), id]);

        const fullPath = path.join(__dirname, "..", "uploads", file);
        fs.unlink(fullPath, err => {
            if (err) {
                console.error(`Failed to delete file: ${file}`, err);
                res.status(500).json({ error: "Failed to delete file from storage." });
                return;
            }
            res.json({ message: "File deleted successfully" });
        });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ error: "Failed to delete file." });
    }
});

// DELETE a record and its associated files
router.delete('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        await pool.query('BEGIN');

        const recordResult = await pool.query('SELECT file_paths FROM records WHERE id = $1', [id]);
        if (recordResult.rows.length === 0) {
            res.status(404).json({ error: 'Record not found.' });
            await pool.query('ROLLBACK');
            return;
        }

        const existingFiles: string[] = recordResult.rows[0]?.file_paths || [];

        // Delete each associated file from the filesystem
        for (const file of existingFiles) {
            const fullPath = path.join(__dirname, '..', 'uploads', file);
            try {
                fs.unlinkSync(fullPath);
            } catch (err) {
                console.error(`Failed to delete file: ${file}`, err);
                // Continue with the next file
            }
        }
        await pool.query('DELETE FROM records WHERE id = $1', [id]);
        await pool.query('COMMIT');
        res.json({ message: 'Record and associated files deleted successfully.' });
    } catch (error) {
        console.error('Error deleting record and files:', error);
        await pool.query('ROLLBACK');
        res.status(500).json({ error: 'Failed to delete record and associated files.' });
    }
});

// Serve uploaded files statically
router.use("/uploads", express.static("uploads"));

export default router;
