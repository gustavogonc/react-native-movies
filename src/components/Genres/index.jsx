import { Container, Name } from "./styles";

export function Genres({ data }) {
  return (
    <Container>
      <Name>{data}</Name>
    </Container>
  );
}
