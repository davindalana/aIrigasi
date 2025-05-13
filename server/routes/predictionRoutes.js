const express = require('express');
const router = express.Router();

// Prediction route (temporary without ML model)
router.post('/', (req, res) => {
    const { moisture, temperature, pH } = req.body;

    // Simple rule-based prediction (placeholder for ML model)
    const needsWatering = moisture < 40;
    const confidence = 0.8 + Math.random() * 0.15;

    res.json({
        needsWatering,
        confidence,
        timestamp: new Date(),
    });
});

module.exports = router;