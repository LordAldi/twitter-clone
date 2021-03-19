import { gql, useMutation } from "@apollo/client";
import { Formik, ErrorMessage, Field, Form } from "formik";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import TwitterLogo from "../styles/assets/twitter-logo.png";
const SIGNUP_MUTATION = gql`
  mutation signup($name: String, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
    }
  }
`;

interface SignupValues {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}
function Signup() {
  const [signup, { data }] = useMutation(SIGNUP_MUTATION);
  const history = useHistory();
  const initialValues: SignupValues = {
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid Email Address")
      .required("Email Required"),
    password: Yup.string()
      .max(20, "Must be 20 character or less")
      .required("Password Required"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password")],
      "Password must match"
    ),
    name: Yup.string()
      .max(15, "Must be 15 vharacter or less")
      .required("Name Required"),
  });
  return (
    <div className="container">
      <img
        src={TwitterLogo}
        alt="logo"
        style={{ width: "50px" }}
        className="logo"
      />
      <h3>Sign up</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const response = await signup({
            variables: values,
          });
          localStorage.setItem("token", response.data.signup.token);
          setSubmitting(false);
          history.push("/users");
        }}
      >
        <Form>
          <Field name="email" type="text" placeholder="Email" />
          <ErrorMessage name="email" component={"div"} />
          <Field name="name" type="text" placeholder="Name" />
          <ErrorMessage name="name" component={"div"} />
          <Field name="password" type="password" placeholder="Password" />
          <ErrorMessage name="password" component={"div"} />
          <Field
            name="confirmPassword"
            type="password"
            placeholder="ConfirmPassword"
          />
          <ErrorMessage name="confirmPassword" component={"div"} />
          <button type="submit" className="login-button">
            <span>Signup</span>
          </button>
        </Form>
      </Formik>
      <div className="register">
        <h4>already have account?</h4>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
export default Signup;
