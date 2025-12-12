// import { useSignUp } from "@clerk/clerk-expo";
// import { View, Text, TextInput, Button } from "react-native";
// import { useState } from "react";
//
// export default function SignUp() {
//     const { signUp, setActive, isLoaded } = useSignUp();
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//
//     const handleSignUp = async () => {
//         if (!isLoaded) return;
//
//         await signUp.create({ emailAddress: email, password });
//
//         await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
//
//         // In production: show input for verification code
//         const result = await signUp.attemptEmailAddressVerification({ code: "12345" });
//
//         await setActive({ session: result.createdSessionId });
//     };
//
//     return (
//         <View>
//             <Text>Sign Up</Text>
//
//             <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
//             <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
//
//             <Button title="Create Account" onPress={handleSignUp} />
//         </View>
//     );
// }
