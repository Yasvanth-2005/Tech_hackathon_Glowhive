import 'package:flutter/material.dart';
import 'package:girls_grivince/Home/complaint.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:girls_grivince/Home/home.dart';
import 'package:girls_grivince/Login/signup.dart';
import 'package:girls_grivince/widgets/button.dart';
import 'package:girls_grivince/widgets/otheroptions.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Login extends StatefulWidget {
  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  bool isPasswordVisible = false;
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  bool isLoading = false;
  String? errorMessage;

   // Function to store token
  Future<void> storeToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  Future<void> loginUser() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    final url =
        Uri.parse('https://glowhive-hackthon.onrender.com/api/user/login');
    final body = {
      "email": emailController.text.trim(),
      "password": passwordController.text.trim(),
    };

    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: json.encode(body),
      );

      print("Status Code: ${response.statusCode}");
      print("Response Body: ${response.body}");

      if (response.statusCode == 200) {
        // Decode the JSON response
        final data = json.decode(response.body);

        // Save the token
          await storeToken(data['token']);

        // Check for user and token fields
        if (data['user'] != null && data['token'] != null) {
          // Navigate to Home screen on successful login
          final ischeckd = data['user']['is_checked'];
          final name = data['user']['username'];
          final email = data['user']['email'];
          final phone = data['user']['phno'];
          final count = data['user']['complaints'].length.toString();
          print(data['user']['complaints']);

          Navigator.of(context).pushReplacement(
            MaterialPageRoute(
              builder: (context) => Home(
                check: ischeckd,
                name: name,
                email: email,
                phone: phone,
                count: count,
              ),
            ),
          );
        } else {
          setState(() {
            errorMessage = "Unexpected response format. Please try again.";
          });
        }
      } else {
        setState(() {
          errorMessage = "Login failed. Status code: ${response.statusCode}";
        });
      }
    } catch (e) {
      print("Error: $e");
      setState(() {
        errorMessage =
            "An error occurred. Check your connection and try again.";
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // Background Image
          Positioned.fill(
            child: Image.asset(
              'assets/img/loginhome.png',
              fit: BoxFit.cover,
            ),
          ),
          // Back Arrow
          Positioned(
            top: 53,
            left: 20,
            child: GestureDetector(
              onTap: () => Navigator.of(context).pop(),
              child: Image.asset(
                'assets/img/arrow.png',
                height: 44,
                width: 65,
              ),
            ),
          ),
          // Login Form
          SingleChildScrollView(
            child: Padding(
              padding:
                  const EdgeInsets.symmetric(horizontal: 20.0, vertical: 80.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 160),
                  // Login Title
                  Text(
                    'Login',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                  SizedBox(height: 40),
                  // Email Field
                  Text(
                    'Email:',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  SizedBox(height: 10),
                  TextField(
                    controller: emailController,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.grey[200],
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10.0),
                        borderSide: BorderSide.none,
                      ),
                      hintText: 'Enter email',
                      prefixIcon: Icon(Icons.email_outlined),
                    ),
                  ),
                  SizedBox(height: 20),
                  // Password Field
                  Text(
                    'Password:',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  SizedBox(height: 10),
                  TextField(
                    controller: passwordController,
                    obscureText: !isPasswordVisible,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.grey[200],
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10.0),
                        borderSide: BorderSide.none,
                      ),
                      prefixIcon: Icon(Icons.lock_outline),
                      hintText: 'Enter your password',
                      suffixIcon: IconButton(
                        icon: Icon(
                          isPasswordVisible
                              ? Icons.visibility
                              : Icons.visibility_off,
                          color: Colors.purple,
                        ),
                        onPressed: () {
                          setState(() {
                            isPasswordVisible = !isPasswordVisible;
                          });
                        },
                      ),
                    ),
                  ),
                  SizedBox(height: 10),
                  // Error Message
                  if (errorMessage != null)
                    Text(
                      errorMessage!,
                      style: TextStyle(color: Colors.red, fontSize: 14),
                    ),
                  SizedBox(height: 30),
                  // Login Button
                  Button(
                    text: isLoading ? 'Loading...' : 'Login',
                    function: loginUser,
                  ),
                  SizedBox(height: 20),
                  // Sign-Up Text
                  Otheroptions(
                    text1: 'Don\'t have an account? ',
                    text2: 'Sign Up',
                    function: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => Signup(),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
