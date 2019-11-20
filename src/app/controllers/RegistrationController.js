import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Registration from '../models/Registration';

class RegistrationController {
  async index(__, res) {
    return res.json({ ok: 'ok' });
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

    return res.json({ registrate });
  }
}

export default new RegistrationController();
