"use client";

// import "./Signup.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { initializeApp } from "firebase/app";
import {
  firebaseAuth,
  firebaseConfig,
} from "../../lib/firebase/firebaseConfig";
import db from "../../lib/firebase/firesStore";
import { setDoc, doc } from "firebase/firestore";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Emailul este obligatoriu",
  }),
  password: z.string().min(6, {
    message: "Parola trebuie sa contina minim 6 caractere",
  }),
});

const SignupPage = () => {
  const auth = firebaseAuth;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;
        await setDoc(doc(db, "clients/" + user.uid), {
          clientId: user.uid,
          email: user.email,
          role: "USER",
        });
        localStorage.setItem(
          "auth_token",
          JSON.stringify(await user.getIdToken())
        );
        // de facut redirect catre homepage
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>Parola</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default SignupPage;
