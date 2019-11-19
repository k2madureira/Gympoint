import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(__, res) {
    const plans = await Plan.findAll();

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .integer()
        .required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const planExists = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (planExists) {
      return res.status(400).json({ error: 'Plan already exists.' });
    }

    const { title, duration, price } = await Plan.create(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  // eslint-disable-next-line consistent-return
  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .integer()
        .required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails. ' });
    }

    const { title } = req.body;
    const { id } = req.params;

    const plan = await Plan.findOne({
      where: { id },
    });

    if (title !== plan.title) {
      const planExists = await Plan.findOne({ where: { title } });

      if (planExists) {
        return res
          .status(400)
          .json({ error: 'This title plan, already used. ' });
      }

      const { duration, price } = await plan.update(req.body);

      return res.json({
        id,
        title,
        duration: `${duration} Months`,
        price: `R$ ${price},00`,
      });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    const plan = await Plan.findOne({
      where: { id },
    });

    if (!plan) {
      return res.status(400).json({ error: "This plan don't exist." });
    }

    await plan.destroy();

    return res.json({ status: 'Plan deleted.' })
  }
}

module.exports = new PlanController();
