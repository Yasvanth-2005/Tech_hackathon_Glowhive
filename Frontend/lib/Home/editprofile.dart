import 'package:flutter/material.dart';
import 'package:girls_grivince/Home/profile.dart';
import 'package:girls_grivince/widgets/button.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

class EditProfile extends StatefulWidget {
  final String eemail;
  final String ename;
  final String ephone;
  final String ecount;

  const EditProfile({
    Key? key,
    required this.eemail,
    required this.ename,
    required this.ephone,
    required this.ecount,
  }) : super(key: key);

  @override
  _EditProfileState createState() => _EditProfileState();
}

class _EditProfileState extends State<EditProfile> {
  late TextEditingController _nameController;
  final _oldPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _isOldPasswordVisible = false;
  bool _isNewPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    // Initialize the name controller with the username value
    _nameController = TextEditingController(text: widget.ename);
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  Future<void> _updateProfile() async {
    if (_newPasswordController.text != _confirmPasswordController.text) {
      _showError("New password and confirm password do not match.");
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // Retrieve the token asynchronously
      final token = await getToken();

      if (token == null) {
        _showError("User is not authenticated. Please log in again.");
        return;
      }

      final response = await http.patch(
        Uri.parse('https://glowhive-hackthon.onrender.com/api/user/edit/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token', // Correctly pass the token
        },
        body: json.encode({
          "username": _nameController.text.isEmpty
              ? widget.ename
              : _nameController.text,
          "oldPassword": _oldPasswordController.text,
          "password": _newPasswordController.text,
        }),
      );

      if (response.statusCode == 200) {
        // Navigate to the profile screen on success
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => Profile(
              username: _nameController.text.isEmpty
                  ? widget.ename
                  : _nameController.text,
              useremail: widget.eemail,
              userphonenum: widget.ephone,
              complaintscount: widget.ecount,
            ),
          ),
        );
      } else {
        final responseData = json.decode(response.body);
        _showError(responseData['message'] ?? "An unexpected error occurred.");
      }
    } catch (e) {
      _showError("An unexpected error occurred. Please try again later.");
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _showError(String message) {
    // Display error in a Snackbar instead of an AlertDialog
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _oldPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          children: [
            Stack(
              children: [
                Image.asset(
                  'assets/img/home2.png',
                  width: double.infinity,
                  height: 150,
                  fit: BoxFit.cover,
                ),
                Positioned(
                  top: 50,
                  left: 20,
                  right: 20,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          GestureDetector(
                            onTap: () {
                              Navigator.of(context).pop();
                            },
                            child: Image.asset(
                              'assets/img/arrow2.png',
                              height: 35,
                              width: 43,
                            ),
                          ),
                          const SizedBox(width: 10),
                          const Text(
                            'Edit Profile',
                            style: TextStyle(
                              fontSize: 25,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 30.0),
              child: Column(
                children: [
                  const SizedBox(height: 30),
                  _buildTextField(
                    labelText: 'Name',
                    controller: _nameController,
                    hintText: widget.ename,
                    isPassword: false,
                  ),
                  const SizedBox(height: 20),
                  _buildTextField(
                    labelText: 'Old Password',
                    controller: _oldPasswordController,
                    hintText: 'Enter old password',
                    isPassword: true,
                    isVisible: _isOldPasswordVisible,
                    toggleVisibility: () {
                      setState(() {
                        _isOldPasswordVisible = !_isOldPasswordVisible;
                      });
                    },
                  ),
                  const SizedBox(height: 20),
                  _buildTextField(
                    labelText: 'New Password',
                    controller: _newPasswordController,
                    hintText: 'Enter new password',
                    isPassword: true,
                    isVisible: _isNewPasswordVisible,
                    toggleVisibility: () {
                      setState(() {
                        _isNewPasswordVisible = !_isNewPasswordVisible;
                      });
                    },
                  ),
                  const SizedBox(height: 20),
                  _buildTextField(
                    labelText: 'Confirm Password',
                    controller: _confirmPasswordController,
                    hintText: 'Enter confirm password',
                    isPassword: true,
                    isVisible: _isConfirmPasswordVisible,
                    toggleVisibility: () {
                      setState(() {
                        _isConfirmPasswordVisible = !_isConfirmPasswordVisible;
                      });
                    },
                  ),
                  const SizedBox(height: 30),
                  _isLoading
                      ? const CircularProgressIndicator()
                      : Button(
                          text: 'Confirm',
                          function: _updateProfile,
                        ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required String labelText,
    required TextEditingController controller,
    required String hintText,
    required bool isPassword,
    bool isVisible = false,
    VoidCallback? toggleVisibility,
  }) {
    return TextField(
      controller: controller,
      obscureText: isPassword && !isVisible,
      decoration: InputDecoration(
        labelText: labelText,
        labelStyle: TextStyle(
          color: Colors.grey.shade700,
        ),
        hintText: hintText,
        hintStyle: TextStyle(color: Colors.grey.shade400),
        enabledBorder: UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.purple),
        ),
        suffixIcon: isPassword
            ? IconButton(
                icon: Icon(
                  isVisible ? Icons.visibility : Icons.visibility_off,
                ),
                onPressed: toggleVisibility,
              )
            : null,
      ),
    );
  }
}
