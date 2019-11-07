import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .positive()
        .integer()
        .required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fail.' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student alredy exists. ' });
    }

    const { id, name, email, age } = await Student.create(req.body);
    return res.json({
      id,
      name,
      email,
      age,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .positive()
        .integer()
        .required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fail.' });
    }

    const { email } = req.body;
    const { id } = req.params;

    const student = await Student.findOne({
      where: { id },
    });

    if (email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res.status(400).json({ error: 'Email alredy exists. ' });
      }
    }

    const { name, age } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      age,
    });
  }

  async show(req, res) {
    const busca = Student.find();

    return res.json({ busca });
  }
}

export default new StudentController();
