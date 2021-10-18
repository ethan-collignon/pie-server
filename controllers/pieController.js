const express = require("express");
const router = express.Router();
const {PieModel} = require('../models');
const {validateSession} = require('../middleware');

// router.get('/', (req, res) => res.send('I love pie'));


//! GET ALL PIES
router.get("/", async(req, res) => {
    try{
        const allPies = await PieModel.findAll();

        res.status(200).json(allPies);
    } catch (err){
        res.status(500).json({error: err});
    };
});

//! CREATE PIE
router.post("/create", validateSession, async (req, res) => {
    const { nameOfPie, baseOfPie, crust, timeToBake, servings, rating } = req.body;
    
    try {
        const Pie = await PieModel.create({
        nameOfPie,
        baseOfPie,
        crust,
        timeToBake,
        servings,
        rating
        });

        res.status(201).json({
            message: "Pie is successfully crated", 
            Pie
        });
    } catch (err) {
        res.status(500).json({
            message: `Failed to create pie: ${err}`
        });
    };
});

//! Update Pie by ID
router.put("/:id", async(req, res) => {
    const { nameOfPie, baseOfPie, crust, timeToBake, servings, rating } = req.body;

    try {
        await PieModel.update({ nameOfPie, baseOfPie, crust, timeToBake, servings, rating }, { where: { id: req.params.id }, returning: true }).then((result) => {
            res.status(200).json({
                message: "Pie successfully updated",
                updatedPie: result
            });
        });
    } catch (err) {
        res.status(500).json({
            message: `Failed to update pie: ${err}`
        });
    }
});

//! Get Pies by name
router.get("/:nameOfPie", async(req, res) => {

    try {
        const locatedPie = await PieModel.findAll({
            where: { nameOfPie: req.params.nameOfPie },
        });
        res
            .status(200)
            .json({ message: "Pies successfully retrieved", locatedPie });
    } catch (err) {
        res.status(500).json({ message: `Failed to retrieve pies: ${err}` });
    }
});

//! Delete Pie by ID
router.delete("/:id", async(req, res) => {
    try{
        const query = {where: {
            id: req.params.id
        }}
        await PieModel.destroy(query)
        res.status(200).json({
            message: "Pie has successfully been deleted"
        })
    } catch(err){
        res.status(500).json({
            message: "Weewoo"
        })
    }
}) 


module.exports = router;