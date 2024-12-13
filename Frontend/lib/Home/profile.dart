import 'package:flutter/material.dart';

class Profile extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Stack for image and header
            Stack(
              children: [
                // Background image
                Image.asset(
                  'assets/img/home2.png',
                  width: double.infinity,
                  height: 150,
                  fit: BoxFit.cover,
                ),
                // Overlay for back button and title
                Positioned(
                  top: 50,
                  left: 20,
                  child: Row(
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
                      SizedBox(width: 10),
                      Text(
                        'Profile',
                        style: TextStyle(
                          fontSize: 25,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            // Profile Section
            Column(
              children: [
                SizedBox(height: 20),
                CircleAvatar(
                  radius: 50,
                  child: Stack(
                    children: [
                      Positioned(
                        bottom: 10,
                        right: 0,
                        child: Icon(Icons.camera_alt,),
                      ),
                    ],
                  ),
                  backgroundImage: NetworkImage(
                    'https://via.placeholder.com/150', // Replace with actual image URL
                  ),
                ),
                SizedBox(height: 20),
              ],
            ),
            // Profile Fields
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  _buildProfileField(
                    icon: Icons.person,
                    label: 'Name',
                    value: 'Kajal Mandraju',
                    isEditable: true,
                  ),
                  SizedBox(height: 20),
                  _buildProfileField(
                    icon: Icons.email,
                    label: 'Email',
                    value: 'kajalmandraju@gmail.com',
                    isEditable: false,
                  ),
                  SizedBox(height: 20),
                  _buildProfileField(
                    icon: Icons.call,
                    label: 'Mobile Number',
                    value: '9502774125',
                    isEditable: false,
                  ),
                  SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Complaints Count:',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Container(
                        padding:
                            EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: Colors.purple.shade100,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '5',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.purple,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileField({
    required IconData icon,
    required String label,
    required String value,
    required bool isEditable,
  }) {
    return Row(
      children: [
        Icon(icon, color: Colors.purple),
        SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey.shade600,
                ),
              ),
              Text(
                value,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
        if (isEditable)
          IconButton(
            onPressed: () {
              // Add edit functionality here
            },
            icon: Icon(Icons.edit, color: Colors.purple),
          ),
      ],
    );
  }
}
