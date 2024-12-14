import 'package:flutter/material.dart';
import 'package:girls_grivince/Home/complaint.dart';
import 'package:girls_grivince/Home/emergency.dart';
import 'package:girls_grivince/Home/help.dart';
import 'package:girls_grivince/Home/profile.dart';
import 'package:girls_grivince/Home/status.dart';
import 'package:girls_grivince/Home/sos.dart';
import 'package:girls_grivince/widgets/categorybtn.dart';

class Home extends StatefulWidget {
  final bool check;
  final String email;
  final String name;
  final String phone;
  final String count;
  const Home({
    super.key,
    required this.check,
    required this.email,
    required this.name,
    required this.phone,
    required this.count,
  });

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  @override
  Widget build(BuildContext context) {
    final username = widget.name;
    final useremail = widget.email;
    final userphone = widget.phone;
    final complintscount = widget.count;

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
          // Content
          Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 20.0, vertical: 60.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Title
                SizedBox(height: 30),
                Text(
                  "Welcome",
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
                SizedBox(height: 10),
                Text(
                  widget.name,
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
                SizedBox(height: 70),
                // Category buttons in grid
                Expanded(
                  child: GridView.count(
                    crossAxisCount: 2,
                    crossAxisSpacing: 20,
                    mainAxisSpacing: 20,
                    children: [
                      Categorybtn(
                          title: "SOS",
                          imagePath: 'assets/img/sos.png',
                          function: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (builder) => Sos(),
                              ),
                            );
                          }),
                      Categorybtn(
                        title: "Complaint",
                        imagePath: 'assets/img/complaint.png',
                        function: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (builder) => Complaint(),
                            ),
                          );
                        },
                      ),
                      Categorybtn(
                        title: "Complaint Status",
                        imagePath: 'assets/img/status.png',
                        function: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (builder) => Status(),
                            ),
                          );
                        },
                      ),
                      Categorybtn(
                        title: "Support",
                        imagePath: 'assets/img/support.png',
                        function: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (builder) => Emergency(),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Help Button
          Positioned(
            bottom: 20,
            left: 20,
            child: GestureDetector(
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (builder) => Help(),
                  ),
                );
              },
              child: Container(
                decoration: BoxDecoration(
                  color: Color.fromRGBO(169, 61, 231, 0.91),
                  borderRadius: BorderRadius.circular(50),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Icon(
                    Icons.help_outline,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
          Positioned(
            bottom: 20,
            right: 20,
            child: GestureDetector(
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (builder) => Profile(
                      username: username,
                      useremail: useremail,
                      userphonenum: userphone,
                      complaintscount: complintscount,
                    ),
                  ),
                );
              },
              child: Container(
                decoration: BoxDecoration(
                  color: Color.fromRGBO(169, 61, 231, 0.91),
                  borderRadius: BorderRadius.circular(50),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Icon(
                    Icons.person,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
