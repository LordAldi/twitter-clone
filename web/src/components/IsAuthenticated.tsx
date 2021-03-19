import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { ReactNode } from "react";
import { Redirect } from "react-router-dom";

const IS_LOGGED_IN = gql`
  {
    me {
      id
    }
  }
`;
interface IProps {
  children: ReactNode;
}
export default function IsAuthenticated({ children }: IProps) {
  const { loading, error, data } = useQuery(IS_LOGGED_IN);
  if (loading) return <p>loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!data.me) {
    return <Redirect to={{ pathname: "/landing" }} />;
  }
  return <>{children}</>;
}
