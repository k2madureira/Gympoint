/* mport * as Yup from 'yup'; */

import Help from '../models/HelpOrder';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import OrderMail from '../jobs/OrderMail';

class HelpController {
  async index(__, res) {
    const find = await Help.findAll({
      where: { answer: null },
      attributes: ['question', 'createdAt'],
    });

    return res.json({
      helps: find,
    });
  }

  async findId(req, res) {
    const findStudent = await Student.findByPk(req.params.id);
    const findHelpOrders = await Help.findAll({
      where: { student_id: req.params.id },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    let error = '';
    if (!findStudent) {
      error = 'Unregistered student.';
    } else if (!findHelpOrders) {
      error = "This student don't have question.";
    }

    if (error) {
      return res.status(400).json({ error });
    }

    return res.json({
      question: findHelpOrders,
    });
  }

  async store(req, res) {
    const { question } = req.body;
    const { id } = req.params;

    const findStudent = await Student.findOne({
      where: { id },
    });

    let error = '';
    if (!findStudent) {
      error = 'Unregistered student.';
    } else if (!question) {
      error = 'Please, make a question.';
    }

    if (error) {
      return res.status(400).json({ error });
    }
    const helporder = await Help.create({
      student_id: id,
      question,
    });

    return res.json({
      helporder,
    });
  }

  async answer(req, res) {
    const { id } = req.params;
    const { answer } = req.body;

    const findQuestion = await Help.findByPk(id);
    if (!findQuestion) {
      return res.status(400).json({ error: "This question don't exist ." });
    }
    const createAnswer = await findQuestion.update({
      answer,
      answerAt: new Date(),
    });

    const findStudent = await Student.findOne({
      where: { id: createAnswer.student_id },
    });

    await Queue.add(OrderMail.key, {
      findStudent,
      createAnswer,
    });
    return res.json({ createAnswer });
  }
}

export default new HelpController();
