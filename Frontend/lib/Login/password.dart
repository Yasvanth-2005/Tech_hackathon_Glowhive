import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'package:girls_grivince/Home/home.dart';
import 'package:girls_grivince/Login/login.dart';
import 'package:girls_grivince/widgets/button.dart';
import 'package:girls_grivince/widgets/otheroptions.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Password extends StatefulWidget {
  final String name;
  final String email;
  final String phone;
  const Password({
    super.key,
    required this.name,
    required this.email,
    required this.phone,
  });

  @override
  State<Password> createState() => _PasswordState();
}

class _PasswordState extends State<Password> {
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController =
      TextEditingController();
  bool isPasswordVisible = false;
  bool isConfirmPasswordVisible = false;
  bool isLoading = false;

  String extractCollegeId(String email) {
    return email.substring(0, 7); // First 7 characters of the email
  }

  Future<void> registerUser({
    required String username,
    required String email,
    required String phno,
    required String password,
  }) async {
    final url =
        Uri.parse('https://glowhive-hackthon.onrender.com/api/user/register');

    final collegeId = extractCollegeId(email);

    final body = {
      "username": username,
      "collegeId": collegeId,
      "phno": phno,
      "email": email,
      "password": password,
    };

    try {
      final response = await http.post(
        url,
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Registration successful!')),
        );
        final data = json.decode(response.body);
        final token = data['token'];
        final isChecked = data['user']['is_checked'];
        final email = data['user']['email'];
        final phone = data['user']['phno'];
        final name = data['user']['username'];
        final count = data['user']['complaints'].length.toString();

        // Store the token in SharedPreferences
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(
            builder: (context) => Home(
              check: isChecked,
              name: name,
              email: email,
              phone: phone,
              count: count,
            ),
          ),
        );
      } else {
        final responseBody = jsonDecode(response.body);
        final errorMessage = responseBody['message'] ?? 'Registration failed.';
        throw Exception(errorMessage);
      }
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $error')),
      );
    }
  }

  @override
  void dispose() {
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double height = MediaQuery.of(context).size.height;
    double width = MediaQuery.of(context).size.width;
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // Content
          Container(
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage('assets/img/loginhome.png'),
                fit: BoxFit.cover,
              ),
            ),
            child: SingleChildScrollView(
              child: SizedBox(
                height: height,
                width: width,
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 20.0, vertical: 60.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(height: 150),
                      Text(
                        'Password',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                      SizedBox(height: 40),

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
                        controller: passwordController,
                      ),
                      SizedBox(height: 20),

                      // Confirm Password Field
                      Text(
                        'Confirm Password:',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      SizedBox(height: 10),
                      TextField(
                        obscureText: !isConfirmPasswordVisible,
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: Colors.grey[200],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10.0),
                            borderSide: BorderSide.none,
                          ),
                          prefixIcon: Icon(Icons.lock_outline),
                          hintText: 'Confirm password',
                          suffixIcon: IconButton(
                            icon: Icon(
                              isConfirmPasswordVisible
                                  ? Icons.visibility
                                  : Icons.visibility_off,
                              color: Colors.purple,
                            ),
                            onPressed: () {
                              setState(() {
                                isConfirmPasswordVisible =
                                    !isConfirmPasswordVisible;
                              });
                            },
                          ),
                        ),
                        controller: confirmPasswordController,
                      ),
                      SizedBox(height: 30),

                      // Confirm Button
                      Button(
                        text: isLoading ? 'Loading...' : 'Confirm',
                        function: () async {
                          if (isLoading) return;

                          setState(() {
                            isLoading = true;
                          });

                          try {
                            final username = widget.name;
                            final email = widget.email;
                            final phno = widget.phone;
                            final password = passwordController.text;
                            final confirmPassword =
                                confirmPasswordController.text;

                            if (password.isEmpty || confirmPassword.isEmpty) {
                              throw Exception('Please fill in all fields.');
                            }
                            if (password != confirmPassword) {
                              throw Exception('Passwords do not match.');
                            }

                            await registerUser(
                              username: username,
                              email: email,
                              phno: phno,
                              password: password,
                            );
                          } catch (error) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(error.toString())),
                            );
                          } finally {
                            setState(() {
                              isLoading = false;
                            });
                          }
                        },
                      ),

                      SizedBox(height: 20),

                      // Other Options
                      Otheroptions(
                        text1: 'Already have an account? ',
                        text2: 'Log In',
                        function: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (builder) => Login(),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          // Back Button
          Positioned(
            top: 43,
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
        ],
      ),
    );
  }
}
