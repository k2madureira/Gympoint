import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class OrderMail {
  get key() {
    return 'OrderMail';
  }

  async handle({ data }) {
    const { findStudent, createAnswer } = data;

    await Mail.sendMail({
      to: `${findStudent.name} <${findStudent.email}>`,
      subject: 'Answer Gympoint',
      template: 'helpOrder',
      context: {
        student: findStudent.name,
        question: createAnswer.question,
        answer: createAnswer.answer,
        date: format(
          parseISO(createAnswer.answerAt),
          "'dia' dd 'de' MMMM 'de ' yyyy",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new OrderMail();
