import { Button, Container, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/models";

type FormData = {
  username: string,
  email: string,
  password: string,
  streetAddress: string,
  city: string,
  province: string,
  country: string,
  postalCode: string,
  phone: string
}

function SignupForm() {
  const { control, handleSubmit } = useForm<FormData>();
  const [successMessage, setSuccessMessage] = useState("");
  const [signupError, setsignupError] = useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);

    const res = await fetch("http://localhost:3005/signup", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
        address: {
          streetAddress: data.streetAddress,
          city: data.city,
          province: data.province,
          country: data.country,
          postalCode: data.postalCode,
        },
        phone: data.phone,
      }),
    })

    const responseData = await res.json()

    if(res.ok){
      setsignupError(false)
      const userData = responseData as User
      console.log("User created successfully with Id", userData._id)
      setSuccessMessage("Product Added Successfully");
      navigate('/home');
  }
  else{
    setsignupError(true)
      console.error("An error occured while creating user", responseData)
      // setSuccessMessage("Failed to add user");
  }
      // .then(response => {
      //   console.log(response);
      //   if (response.ok) {
      //     setsignupError(false);
      //     return response.json(); // parse response body as JSON
      //   } else {
      //     throw new Error("Error occurred");
      //   }
      // })
      // .then(data => {
      //   setsignupError(false);
      //   console.log(data);
      //   setSuccessMessage("Sign up successful");
      //   setAuthData(data);
      //   navigate('/home');
      // })
      // .catch((err) => {
      //   setsignupError(true);
      //   console.log(err);
      // });
  };

    return (
        <Container>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} sx={{ mt: 12 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Paper elevation={3} component={Stack} direction="column" spacing={1.5} justifyContent="center" sx={{ py: 4, px: 2, width: "400px" }}>
                        <Typography variant='h5' align='center'>Create Account</Typography>
                        <Controller
                            name="username"
                            control={control}
                            rules={{ required: "Please enter your username" }}
                            render={({ field, fieldState: { error } }) => <TextField id="outlined-basic" label="Username" variant="outlined" {...field} error={!!error} helperText={error ? error.message : null} />}
                        />
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: "Please enter your email" }}
                            render={({ field, fieldState: { error } }) => <TextField id="outlined-basic" label="Email" variant="outlined" {...field} error={!!error} helperText={error ? error.message : null} />}
                        />
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: "Please enter a password" }}
                            render={({ field, fieldState: { error } }) => <TextField id="outlined-basic" label="Password" variant="outlined" type='password' {...field} error={!!error} helperText={error ? error.message : null} />}
                        />
                        <Controller
                            name="streetAddress"
                            control={control}
                            rules={{ required: "Please enter your street address" }}
                            render={({ field, fieldState: { error } }) => <TextField id="outlined-basic" label="Street Address" variant="outlined" {...field} error={!!error} helperText={error ? error.message : null} />}
                        />
                        <Controller
                            name="city"
                            control={control}
                            rules={{ required: "Please enter your city" }}
                            render={({ field, fieldState: { error } }) => <TextField id="outlined-basic" label="City" variant="outlined" {...field} error={!!error} helperText={error ? error.message : null} />}
                        />
                        <Controller
                            name="province"
                            control={control}
                            rules={{ required: "Please enter your province" }}
                            render={({ field, fieldState: { error } }) => <TextField id="outlined-basic" label="Province" variant="outlined" {...field} error={!!error} helperText={error ? error.message : null} />}
                        />
                        <Controller
                            name="country"
                            control={control}
                            rules={{ required: "Please enter your country" }}
                            render={({ field, fieldState: { error } }) => <TextField id="outlined-basic" label="Country" variant="outlined" {...field} error={!!error} helperText={error ? error.message : null} />}
                        />
                        <Controller
                            name="postalCode"
                            control={control}
                            rules={{ required: "Please enter your postal code" }}
                            render={({ field, fieldState: { error } }) => <TextField id="outlined-basic" label="Postal Code" variant="outlined" {...field} error={!!error} helperText={error ? error.message : null} />}
                        />
                        <Controller
                            name="phone"
                            control={control}
                            rules={{ required: "Please enter your phone number" }}
                            render={({ field, fieldState: { error } }) => <TextField id="outlined-basic" label="Phone" variant="outlined" {...field} error={!!error} helperText={error ? error.message : null} />}
                        />
                        <div>
                            <Button variant='contained' type="submit" sx={{ width: '100%', alignSelf: 'center', mt: 4 }}>
                                Submit
                            </Button>
                            {!signupError && (
                               <Snackbar open={!!successMessage} message={successMessage} />
                            )}
                            {signupError && (
                                <Typography align='center' color={'red'}>
                                    Username taken, try again
                                </Typography>
                            )}
                        </div>

                        {/* <Typography align='center'>
                    Don't have an account? <a href={signUpUrl}>Sign up </a> here.
                    */}
                    </Paper>
                </form>
            </Stack>


        </Container>
    );
}

export default SignupForm;
function setAuthData(data: any) {
    throw new Error("Function not implemented.");
}

