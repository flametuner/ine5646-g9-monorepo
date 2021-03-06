import { ApolloQueryResult } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  Col,
  Row,
  Toast,
  ToastBody,
  ToastContainer,
} from "react-bootstrap";
import { QuestionQuery, useAnswerQuestionMutation } from "../../../graphql/generated";
import { Alternative } from "./Alternative";

interface Question {
  id: string;
  title: string;
  totalVotes: number;
  createdAt: any;
  expiresAt: any;
  userVoted: number;
  alternatives: {
    alternativeId: number;
    text: string;
    votes: number;
  }[];
  creator: {
    username: string;
  };

  refetch: () => Promise<ApolloQueryResult<QuestionQuery>>;
}

export function Question({
  title,
  alternatives,
  id,
  // description,
  expiresAt,
  totalVotes,
  userVoted,
  refetch
}: Question): JSX.Element {
  const [vote, { data, error }] = useAnswerQuestionMutation();
  const [toast, setToast] = useState(false);
  const [voted, setVoted] = useState<number>(userVoted);
  const expiration = new Date(expiresAt);

  function getWinner() {
    if (expiration.getTime() - new Date().getTime() > 0) return null;
    if (totalVotes == 0) return null;
    return alternatives.reduce((prev, current) => {
      if (current.votes > prev.votes) return current;
      return prev;
    });
  }

  const winner = getWinner();
  
  useEffect(() => {
    const vote = data?.answerQuestion;
    if (vote) {
      setVoted(vote.alternativeId);
      refetch();
    }
  }, [data, setVoted, refetch]);

  async function onVote(index: number) {
    if (voted != -1) return;
    vote({
      variables: {
        choosedAlt: index,
        qustionId: parseInt(id),
      },
    });
  }

  const choiceElement = alternatives.map((alternative) => {
    const id = alternative.alternativeId;
    return (
      <Alternative
        key={id}
        index={id}
        alternative={alternative}
        winner={winner ? winner == alternative : false}
        voted={voted == id}
        onVote={onVote}
      />
    );
  });

  const timeLeft = expiration.getTime() - new Date().getTime();
  const seconds = Math.floor(timeLeft / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  let timeLeftString = "";
  if (days > 0) {
    timeLeftString = `${days} dias restantes`;
  } else if (hours > 0) {
    timeLeftString = `${hours} horas restantes`;
  } else if (minutes > 0) {
    timeLeftString = `${minutes} minutos restantes`;
  } else if (seconds > 0) {
    timeLeftString = `${seconds} segundos restantes`;
  } else {
    timeLeftString = `expirado em ${expiration.toLocaleDateString("pt-BR")}`;
  }
  return (
    <>
      <Card
        className="mb-3 h-100"
        onMouseEnter={() => setToast(true)}
        onMouseLeave={() => setToast(false)}
      >
        <Card.Header className="bg-secondary text-white">
          pergunta #{id}
        </Card.Header>
        <Card.Body className="fixed-height">
          <Card.Title className="text-center">{title}</Card.Title>
          {/* {description && <Card.Text>{description}</Card.Text>} */}
          <div className="d-flex h-100">
            <Row className="align-self-center w-100">
              <Col className="d-flex flex-column align-items-center">
                {choiceElement}
              </Col>
            </Row>
          </div>
        </Card.Body>
        <Card.Footer className="text-muted text-end">
          {timeLeftString}
        </Card.Footer>
      </Card>
      <ToastContainer
        position="bottom-end"
        className="position-fixed p-3"
        style={{ zIndex: 11 }}
      >
        <Toast show={toast}>
          <Toast.Header>
            <strong className="me-auto">pergunta #{id}</strong>
            <small>{timeLeftString}</small>
          </Toast.Header>
          <ToastBody>
            <p>Total de votos: {totalVotes}</p>
            {winner ? (
              <p>
                Resultado final: {winner.text} com {winner.votes} votos
              </p>
            ) : null}
          </ToastBody>
        </Toast>
      </ToastContainer>
    </>
  );
}
