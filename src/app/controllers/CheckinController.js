import * as Yup from 'yup';
import { addMonths, parseISO, format } from 'date-fns';
import Student from '../models/Student';
import Chekin from '../models/Checkin';

class ChekinController {
  async index(__, res) {
    return res.json({ ok: 'ok' });
  }
}

export default new ChekinController();
