require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

const app = express();

app.use(express.json());

// Logic goes here
// importing user context
const School = require("./model/schedule");

// Register
app.post("/schedule/register", auth, async (req, res) => {
	// our register logic goes here...
	try {
		// Get schedule input
		const { name, classe, school, subjects, shift } = req.body;

		// Validate schedule input
		if (!(classe && name && school && subjects && shift)) {
			res.status(400).send({ message: 'Todos campos devem ser preenchidos!' });
		}

		// check if schedule already exist
		// Validate if schedule exist in our database
		const oldSchedule = await School.findOne({ name, school, classe, shift });

		if (oldSchedule) {
			return res.status(409).send({ message: 'Horário já registrado.' });
		}

		// Create schedule in our database
		const schedule = await School.create({
			name, classe, school, subjects, shift
		});

		// return new schedule
		return res.status(201).json(schedule);
	} catch (err) {
		console.log(err);
		return res.status(500).send({ message: 'Erro ao criar horários.' })
	}
});

app.post("/schedule/:id", auth, async (req, res) => {
	const id = req.params.id

	const { name, classe, school, subjects, shift } = req.body;

	try {
		schedule = await School.findOneAndUpdate({ id }, {
			name, classe, school, subjects, shift
		});
		return res.status(204).json(schedule)
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Erro ao editar horários" })
	}


});

app.get("/schedules/:school", auth, async (req, res) => {
	const { school } = req.params
	const schedules = await School.find({ school })
	if (schedules) {
		return res.status(200).json(schedules)
	} else {
		return res.status(404).send({ message: "Horários não encontrado" })
	}
});

app.get("/schedule/:id", auth, async (req, res) => {
	try {
		const { id } = req.params
		const schedule = await School.findById(id)
		if (schedule) {
			return res.status(200).send(schedule)
		} else {
			return res.status(404).send({ message: 'Nenhuma horários removido!' })
		}
	} catch (error) {
		return res.status(500).send({ message: 'Erro no servidor!' })
	}
})

app.delete("/schedule/:id", auth, async (req, res) => {
	try {
		const { id } = req.params
		const user = await School.findByIdAndDelete(id)
		if (user) {
			return res.status(200).send({ message: 'Horário removido com sucesso!' })
		} else {
			return res.status(404).send({ message: 'Nenhuma horários removido!' })
		}
	} catch (error) {
		return res.status(500).send({ message: 'Erro no servidor!' })
	}
})

module.exports = app;