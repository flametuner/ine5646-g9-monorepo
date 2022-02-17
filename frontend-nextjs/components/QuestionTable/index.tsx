import { Col, Container, Row } from "react-bootstrap";
import { QuestionPage } from "./QuestionPage";
import { Question } from "./Question";

const questionList = [
  {
    title: "Quem irá vencer as eleições de 2022 no Brasil?",
    choices: ["Lula", "Bolsonaro", "Moro", "Nenhum deles"],
    expiration: new Date(2022, 9, 30),
    votes: 890,
  },
  {
    title: "Bitcoin chegará a US$100k até final de 2022?",
    choices: ["Sim", "Não"],
    expiration: new Date(2022, 11, 30),
    votes: 1023,
  },
  {
    title: "O grupo #9 vai receber nota 10 no AG2?",
    choices: ["Sim", "Claro", "Com certeza", "Isso é uma pergunta?"],
    expiration: new Date(2022, 1, 18),
    votes: 2,
  },
  {
    title: "Quem irá vencer as eleições de 2018 no Brasil?",
    choices: ["Haddad", "Bolsonaro", "Alckmin", "Nenhum deles"],
    expiration: new Date(2018, 11, 30),
    votes: 2432,
    winner: {
      name: "Bolsonaro",
      votes: 923,
    }
  },
];

export function QuestionTable(): JSX.Element | null {
  const groupSize = 2;
  const questionsElement = questionList
    .map((question, index) => {
      return (
        <Col
          key={index}
          xs={12}
          lg={6}
          className={index % 2 == 0 ? "mb-3 mb-lg-0" : ""}
        >
          <Question key={index} index={index + 1} {...question} />
        </Col>
      );
    })
    .reduce<JSX.Element[][]>((r, element, index) => {
      index % groupSize === 0 && r.push([]);
      r[r.length - 1].push(element);
      return r;
    }, [])
    .map((row, index) => (
      <Row className="mt-3" key={index}>
        {row}
      </Row>
    ));

  return (
    <Container>
      {questionsElement}
      <QuestionPage currentPage={1} totalPages={10} />
    </Container>
  );
}
