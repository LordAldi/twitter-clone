import { gql, useMutation } from "@apollo/client";
import { Formik, ErrorMessage, Field, Form } from "formik";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import TwitterLogo from "../styles/assets/twitter-logo.png";
import "../styles/login.css";

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

interface LoginValues {
  email: string;
  password: string;
}
function Login() {
  const [login, { data }] = useMutation(LOGIN_MUTATION);
  const history = useHistory();
  const initialValues: LoginValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid Email Address")
      .required("Email Required"),
    password: Yup.string()
      .max(20, "Must be 20 character or less")
      .required("Password Required"),
  });
  return (
    <div className="container">
      <img
        src={TwitterLogo}
        alt="logo"
        style={{ width: "50px" }}
        className="logo"
      />
      <h3>Log in to Twitter clone</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const response = await login({
            variables: values,
          });
          localStorage.setItem("token", response.data.login.token);
          setSubmitting(false);
          history.push("/users");
        }}
      >
        <Form>
          <Field name="email" type="text" placeholder="Email" />
          <ErrorMessage name="email" component={"div"} />
          <Field name="password" type="password" placeholder="Password" />
          <ErrorMessage name="password" component={"div"} />
          <button type="submit" className="login-button">
            <span>Login</span>
          </button>
        </Form>
      </Formik>
      <div className="register">
        <h4>Dont have an account</h4>
        <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}
export default Login;
