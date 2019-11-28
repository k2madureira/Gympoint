import { format, startOfWeek, endOfWeek } from 'date-fns';
import { Op } from 'sequelize';
import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
  async index(__, res) {
    const checkins = await Checkin.findAll({
      attributes: ['createdAt'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });
    return res.json({ checkins });
  }

  async store(req, res) {
    const { id } = req.params;
    const today = new Date();
    const checkins = await Checkin.findAll({
      where: { student_id: id },
      createdAt: {
        [Op.between]: [startOfWeek(today), endOfWeek(today)],
      },
    });
    if (checkins.length >= 5) {
      return res
        .status(400)
        .json({ error: "You already reached this week's Checkins limit" });
    }

    const storeCheckin = await Checkin.create({
      student_id: id,
    });

    return res.json({
      success: ` successfully checked in on day (${format(
        storeCheckin.createdAt,
        'dd/mm/yyyy'
      )})`,
    });
  }

  async list(req, res) {
    const { id } = req.params;
    const checkins = await Checkin.findAll({
      where: { student_id: id },
      attributes: ['student_id', 'createdAt'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });
    return res.json({ checkins });
  }
}

export default new CheckinController();
