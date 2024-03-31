import { Button, Container, Paper, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AuthDataContext } from '../../App';
import { useNavigate } from 'react-router-dom';

// import './Login.css'


type FormData = {
  username: string,
  password: string
}

type LoginFormProps = {
  signUpUrl: string
}

function LoginForm({ signUpUrl }: LoginFormProps) {

  // const [username, setUser] = useState('');
  // const [password, setPass] = useState('');

  const { control, handleSubmit } = useForm<FormData>();

  const { authData, setAuthData } = useContext(AuthDataContext)
  const [loginError, setLoginError] = useState(false)
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");


  const onSubmit: SubmitHandler<FormData> = data => {
    console.log(data)

    fetch("http://localhost:3005/login", {
      method: "POST",
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        username: data.username,
        password: data.password
      })
    })
      .then(response => {
        console.log(response);
        const data = response.json() //// parse response body as JSON
        if(response.ok){
          return data
        }else{
          throw new Error("Error occurred")
          // data.then(err => {
          //   throw new Error(err)
          // })
        }
      })
      .then(data => {
        console.log(data);
        //localStorage.setItem("auth", JSON.stringify(data)); // save token to localStorage
        setAuthData(data)
        setSuccessMessage("Login sucessfull")
        navigate('/home');
      })
      .catch((err) => {
        setLoginError(true)
        console.log(err);
      })
    ;
  };

  // localStorage.getItem("auth") will give the token


  return (
    <Container>
      <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} sx={{ mt: 12 }}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <Paper elevation={3} component={Stack} direction="column" spacing={1.5} justifyContent="center" sx={{ py: 4, px: 2, width: "400px" }}>
            <Typography variant='h5' align='center'>Welcome back!</Typography>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Please enter your username" }}
              render={({ field, fieldState: { error } }) => <TextField label="Username" variant="outlined" {...field} error={!!error} helperText={error ? error.message : null} />}
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: "Please enter your password" }}
              render={({ field, fieldState: { error } }) => <TextField label="Password" variant="outlined" type='password' {...field} error={!!error} helperText={error ? error.message : null} />}
            />
            <Button variant='contained' type="submit" sx={{ width: '50%', alignSelf: 'center', mt: 4 }}>Login</Button>
            <Snackbar open={!!successMessage} message={successMessage} />
            {loginError && <Typography align='center' color={'red'}>
              An error occurred. Please check your credentials.
            </Typography>}
            <Typography align='center'>
              Don't have an account? <a href={signUpUrl}>Sign up </a> here.
            </Typography>
          </Paper>
        </form>

      </Stack>


    </Container>
  );
}

{/* <div className="form-container">
      <h2>Welcome back!</h2>
      <form action="" method="POST" onSubmit={handleSubmit} >
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required value={username} onChange={(e) => setUser(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required value={password} onChange={(e) => setPass(e.target.value)}/>
        </div>
        <div>
          <button type="submit">Login</button>
          <button type="button"  onClick={handleCancel} >Cancel</button>
        </div>
      </form>
      <p>
        Don't have an account?{' '}
        <a href={signUpUrl}>Sign up here</a>.
      </p>
    </div> */}

export default LoginForm;
