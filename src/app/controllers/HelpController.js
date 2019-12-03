import * as Yup from 'yup';
import { parseISO, format } from 'date-fns';
import Help from '../schemas/Help';
import Student from '../models/Student';

class HelpController {
  async index(__, res) {
    const find = await Help.find({
      answer: null,
    });

    return res.json({ find });
  }

  async findId(req, res) {
    const findStudent = await Student.findByPk(req.params.id);
    const findHelpOrders = await Help.find({
      student_id: req.params.id,
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
      questions: findHelpOrders,
      /* student: findStudent.name,
      answer: findHelpOrders.question,
      question_date: findHelpOrders.createdAt, */ // format(parseISO(find.createdAt), 'dd-mm-yyyy'),
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

    await Help.create({
      student_id: id,
      question: `${findStudent.name} : ${question}`,
      answer: null,
      answer_at: null,
    });

    return res.json({
      question,
      id,
      findStudent,
    });
  }
}

export default new HelpController();
