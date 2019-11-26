import * as Yup from 'yup';
import { addMonths, parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Registration from '../models/Registration';
import Mail from '../../lib/Mail';

class RegistrationController {
  async index(__, res) {
    const registrations = await Registration.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price'],
      order: ['start_date'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration'],
        },
      ],
    });

    return res.json({ registrations });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      plan_id: Yup.number()
        .integer()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Incorrect data' });
    }

    const { student_id, plan_id, start_date } = req.body;
    const findStudent = await Student.findOne({
      where: { id: student_id },
    });

    const findPlan = await Plan.findOne({
      where: { id: plan_id },
    });

    if (!findStudent) {
      return res.status(400).json({ error: 'This student not registrated' });
    }

    if (!findPlan) {
      return res.status(400).json({ error: 'This plan not registrated' });
    }

    const { duration, price } = findPlan;

    const end_date = addMonths(parseISO(start_date), duration);
    const final_price = duration * price;

    const registrate = await Registration.create({
      student_id,
      plan_id,
      start_date: parseISO(start_date),
      end_date,
      price: final_price,
    });

    const findRegistrate = await Registration.findOne({
      where: { id: registrate.id },
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration'],
        },
      ],
    });

    await Mail.sendMail({
      to: `${findRegistrate.student.name} <${findRegistrate.student.email}>`,
      subject: 'Matrícula Gympoint',
      template: 'welcomeStudent',
      context: {
        student: findRegistrate.student.name,
        plan: findRegistrate.plan.title,
        price: findRegistrate.price,
        date: format(findRegistrate.end_date, "'dia' dd 'de' MMMM 'de ' yyyy", {
          locale: pt,
        }),
      },
    });
    return res.json({
      message: 'Successeful Registration!',
      Registrate: findRegistrate,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number()
        .integer()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Incorrect data' });
    }
    const { id } = req.params;
    const { plan_id, start_date } = req.body;

    const findRegistration = await Registration.findOne({
      where: { id },
    });
    if (!findRegistration) {
      return res.status(400).json({ error: "This registration don't exist" });
    }
    const findPlan = await Plan.findOne({
      where: { id: plan_id },
    });

    if (!findPlan) {
      return res.status(400).json({ error: 'This plan not registrated' });
    }
    const { duration, price } = findPlan;
    const end_date = addMonths(parseISO(start_date), duration);
    const final_price = duration * price;

    const registration = await findRegistration.update({
      plan_id,
      start_date,
      end_date,
      price: final_price,
    });

    return res.json({ registration });
  }

  async delete(req, res) {
    const { id } = req.params;

    const registration = await Registration.findOne({
      where: { id },
    });

    if (!registration) {
      return res.status(400).json({ error: "This registration don't exist." });
    }

    await registration.destroy();

    return res.json({ status: 'Registration deleted.' });
  }
}

export default new RegistrationController();
