import 'package:flutter/material.dart';
import 'package:girls_grivince/Login/login.dart';
import 'package:girls_grivince/Login/password.dart';
import 'package:girls_grivince/widgets/button.dart';
import 'package:girls_grivince/widgets/otheroptions.dart';

class Signup extends StatelessWidget {
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
          Positioned(
            top: 43,
            left: 20,
            child: Image.asset('assets/img/arrow.png',height: 44,width: 65,),
          ),
          // Content
          Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 20.0, vertical: 60.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Title
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
                // Name Field
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
                ),
                SizedBox(height: 20),
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
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: Colors.grey[200],
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10.0),
                      borderSide: BorderSide.none,
                    ),
                    hintText: 'Enter your email',
                  ),
                ),
                SizedBox(height: 30),
                Button(
                  text: 'Next',
                  function: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (builder) => Password(),
                      ),
                    );
                  },
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
                        builder: (builder) =>
                            Login(), // Change 'SignUp' to 'Login'
                      ),
                    );
                  },
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}
