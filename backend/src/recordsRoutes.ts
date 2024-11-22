import express, { Request, Response } from "express";
import pool from "./database";

const router = express.Router();

// Enforces structure for POST requests to ensure required fields for record creation.
interface CreateRecordBody {
    sender_name: string;  
    sender_age: number;   
    message: string;     
    filePath?: string; // Optional field when creating new record
}

// Flexibility for PUT requests by making fields optional for partial updates.
interface UpdateRecordBody {
    sender_name?: string; 
    sender_age?: number; 
    message?: string;     
    filePath?: string;    
}

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

// POST a new record
router.post("/", async (req: Request<{}, {}, CreateRecordBody>, res: Response): Promise<void> => {
    const { sender_name, sender_age, message, filePath } = req.body;

    if (!sender_name || !sender_age || !message) {
        res.status(400).json({ error: "Sender's name, age, and message are required" });
        return;
    }

    try {
        const result = await pool.query(
            "INSERT INTO records (sender_name, sender_age, message, file_path) VALUES ($1, $2, $3, $4) RETURNING *",
            [sender_name, sender_age, message, filePath || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating record:", error);
        res.status(500).json({ error: "Failed to create record" });
    }
});

// PUT (Update) a record
router.put("/:id", async (req: Request<{ id: string }, {}, UpdateRecordBody>, res: Response): Promise<void> => {
    const { id } = req.params;
    const { sender_name, sender_age, message, filePath } = req.body;

    // At least one field must be provided for updates; prevents empty updates.
    if (!sender_name && sender_age === undefined && !message && !filePath) {
        res.status(400).json({ error: "At least one field (name, age, message, or filePath) must be provided" });
        return;
    }

    const fields: string[] = [];
    const values: (string | number | null)[] = [];
    let valueIndex = 1;

    if (sender_name) {
        fields.push(`sender_name = $${valueIndex++}`);
        values.push(sender_name);
    }
    // Use `!== undefined` for `sender_age` to allow valid `0` values.
    if (sender_age !== undefined) {
        fields.push(`sender_age = $${valueIndex++}`);
        values.push(sender_age);
    }
    if (message) {
        fields.push(`message = $${valueIndex++}`);
        values.push(message);
    }
    if (filePath) {
        fields.push(`file_path = $${valueIndex++}`);
        values.push(filePath);
    }

    values.push(id); // Add ID to query parameter for WHERE clause.

    const query = `UPDATE records SET ${fields.join(", ")} WHERE id = $${valueIndex} RETURNING *`;

    try {
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({ error: "Record not found" });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error("Error updating record:", error);
        res.status(500).json({ error: "Failed to update record" });
    }
});

// DELETE a record
router.delete("/:id", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM records WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: "Record not found" });
        } else {
            res.json({ message: "Record deleted successfully", record: result.rows[0] });
        }
    } catch (error) {
        console.error("Error deleting record:", error);
        res.status(500).json({ error: "Failed to delete record" });
    }
});

export default router;
