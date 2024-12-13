import 'package:flutter/material.dart';
import 'package:girls_grivince/Home/home.dart';
import 'package:girls_grivince/Login/login.dart';
import 'package:girls_grivince/Login/loginMain.dart';
import 'package:girls_grivince/m.dart';
import 'package:girls_grivince/Login/password.dart';
import 'package:girls_grivince/Login/signup.dart';
import 'package:girls_grivince/Login/signup.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.white),
        primaryColor: Colors.purple,
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,
      home: Home(),
    );
  }
}

