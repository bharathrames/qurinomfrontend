import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const Login = () => {
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('https://qurinom-a6vp.onrender.com/login', values);
        console.log(response.data);

        if (response.status === 200) {
          history.push('/dashboard');
        }
      } catch (error) {
        console.error(error.response.data);
        toast.error('Login failed', { style: { color: 'crimson' } });
      }
    },
  });

  return (
    <div className='overall'>
    <div className="background">
    <div className="shape" style={{ background: 'linear-gradient(#1845ad, #23a2f6)', left: '-80px', top: '-80px' }}></div>
    <div className="shape" style={{ background: 'linear-gradient(to right, #ff512f, #f09819)', right: '-30px', bottom: '-80px' }}></div>
    <form onSubmit={formik.handleSubmit}>
      <h3>Login</h3>
      <div>
        <label className='logorreglable'>Username:</label>
        <input
          type="text"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          placeholder="Enter your username"
          className='regorloginput'
        />
        {formik.touched.username && formik.errors.username ? (
          <div style={{ color: 'crimson' }}>{formik.errors.username}</div>
        ) : null}
      </div>
      <div>
        <label className='logorreglable'>Password:</label>
        <input
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          placeholder="Enter your password"
          className='regorloginput'
        />
        {formik.touched.password && formik.errors.password ? (
          <div style={{ color: 'crimson' }}>{formik.errors.password}</div>
        ) : null}
      </div>
      <div>
        <button type="submit" className='logandregbut'>Login</button>
      </div>
      <div className='regorlog'>Don't have Account ? <Link to="/register" className='insideregorlog'>Register</Link></div>
    </form>
    <ToastContainer />
  </div>
  </div>
  );
};

export default Login;

