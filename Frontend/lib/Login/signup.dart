import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:girls_grivince/Login/login.dart';
import 'package:girls_grivince/Login/password.dart';
import 'package:girls_grivince/widgets/button.dart';
import 'package:girls_grivince/widgets/otheroptions.dart';

class Signup extends StatefulWidget {
  @override
  State<Signup> createState() => _SignupState();
}

class _SignupState extends State<Signup> {
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  bool isLoading = false;

  Future<bool> checkEmailRegistered(String email) async {
    final url =
        Uri.parse("https://glowhive-hackthon.onrender.com/api/user/email");
    try {
      final response = await http.post(
        url,
        body: jsonEncode({"email": email}),
        headers: {"Content-Type": "application/json"},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('Response Data: $data'); // Debugging line
        return data['isRegistered'] == true; // Returns true if the email exists
      } else {
        throw Exception("Failed to check email");
      }
    } catch (error) {
      print("Error checking email: $error");
      return false;
    }
  }

  void validateAndSubmit() async {
    final List<String> errors = [];

    // Validate username
    if (usernameController.text.isEmpty) {
      errors.add('Name is required');
    }

    // Validate email
    if (emailController.text.isEmpty) {
      errors.add('Email is required');
    } else if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(emailController.text)) {
      errors.add('Enter a valid email address');
    }

    // Validate phone number
    if (phoneController.text.isEmpty) {
      errors.add('Phone number is required');
    } else if (!RegExp(r'^\d{10}$').hasMatch(phoneController.text)) {
      errors.add('Enter a valid phone number');
    }

    if (errors.isNotEmpty) {
      // Show all errors in a Snackbar
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(errors.join('\n')),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      isLoading = true;
    });

    // Check if the email is registered or not
    final isEmailRegistered =
        await checkEmailRegistered(emailController.text);

    setState(() {
      isLoading = false;
    });

    if (!isEmailRegistered) {
      // Email is not registered, navigate to the password screen
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => Password(
            name: usernameController.text,
            email: emailController.text,
            phone: phoneController.text,
          ),
        ),
      );
    } else {
      // Email is already registered, show an error dialog
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Email Already Registered"),
          content: Text("The email you entered is already registered."),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(), // Close the dialog
              child: Text("OK"),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    double height = MediaQuery.of(context).size.height;
    double width = MediaQuery.of(context).size.width;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
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
                  padding: const EdgeInsets.only(left: 30, right: 30, top: 60),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(height: 150),
                        Text(
                          'Sign Up',
                          style: TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                        ),
                        SizedBox(height: 40),
                        Text(
                          'Name:',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        SizedBox(height: 10),
                        TextField(
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Colors.grey[200],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10.0),
                              borderSide: BorderSide.none,
                            ),
                            hintText: 'Enter your name',
                          ),
                          controller: usernameController,
                        ),
                        SizedBox(height: 20),
                        Text(
                          'Email:',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        SizedBox(height: 10),
                        TextField(
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Colors.grey[200],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10.0),
                              borderSide: BorderSide.none,
                            ),
                            hintText: 'Enter your email',
                          ),
                          controller: emailController,
                        ),
                        SizedBox(height: 30),
                        Text(
                          'Phone Number:',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        SizedBox(height: 10),
                        TextField(
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Colors.grey[200],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10.0),
                              borderSide: BorderSide.none,
                            ),
                            hintText: 'Enter your Phone num',
                          ),
                          controller: phoneController,
                        ),
                        SizedBox(height: 30),
                        Button(
                          text: isLoading ? 'Loading..' : 'Next',
                          function: validateAndSubmit,
                        ),
                        SizedBox(
                          height: 20,
                        ),
                        Otheroptions(
                          text1: 'Already have an account? ',
                          text2: 'Log In',
                          function: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => Login(),
                              ),
                            );
                          },
                        )
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          Positioned(
            top: 80,
            left: 20,
            child: Image.asset(
              'assets/img/arrow.png',
              height: 44,
              width: 65,
            ),
          ),
        ],
      ),
    );
  }
}
