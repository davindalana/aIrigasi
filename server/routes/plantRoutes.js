const express = require('express');
const router = express.Router();
const PlantData = require('../models/plantModel');

// Get all plant data
router.get('/', async (req, res) => {
    try {
        const plantData = await PlantData.find().sort({ timestamp: -1 });
        res.json(plantData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new plant data
router.post('/', async (req, res) => {
    const plantData = new PlantData(req.body);

    try {
        const newPlantData = await plantData.save();
        res.status(201).json(newPlantData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;