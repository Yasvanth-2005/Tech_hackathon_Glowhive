import 'package:flutter/material.dart';
import 'package:girls_grivince/Home/editprofile.dart';
import 'package:girls_grivince/Login/loginMain.dart';

class Profile extends StatefulWidget {
  final String username;
  final String useremail;
  final String userphonenum;
  final String complaintscount;
  const Profile({
    super.key,
    required this.username,
    required this.useremail,
    required this.userphonenum,
    required this.complaintscount,
  });

  @override
  State<Profile> createState() => _ProfileState();
}

class _ProfileState extends State<Profile> {
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
                // Overlay for back button, title, and menu
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
                      // Three-dot menu
                      PopupMenuButton<String>(
                        icon: Icon(Icons.more_vert, color: Colors.white),
                        onSelected: (value) {
                          if (value == 'Edit Profile') {
                            // Navigate to edit profile screen or implement edit functionality
                            _editProfile();
                          } else if (value == 'Sign Out') {
                            // Implement sign-out functionality
                            _signOut();
                          }
                        },
                        position: PopupMenuPosition.under,
                        offset: Offset(-30, -20),
                        itemBuilder: (context) => [
                          PopupMenuItem(
                            value: 'Edit Profile',
                            child: Text('Edit Profile'),
                          ),
                          PopupMenuItem(
                            value: 'Sign Out',
                            child: Text('Sign Out'),
                          ),
                        ],
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
                  backgroundImage: NetworkImage(
                    'https://via.placeholder.com/150', // Replace with actual image URL
                  ),
                  child: Stack(
                    children: [
                      Positioned(
                        bottom: 10,
                        right: 0,
                        child: Icon(
                          Icons.camera_alt,
                          color: Colors.purple,
                        ),
                      ),
                    ],
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
                    value: widget.username,
                    isEditable: false,
                  ),
                  SizedBox(height: 20),
                  _buildProfileField(
                    icon: Icons.email,
                    label: 'Email',
                    value: widget.useremail,
                    isEditable: false,
                  ),
                  SizedBox(height: 20),
                  _buildProfileField(
                    icon: Icons.call,
                    label: 'Mobile Number',
                    value: widget.userphonenum,
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
                          widget.complaintscount,
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

  void _editProfile() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (builder) => EditProfile(
            eemail: widget.useremail,
            ename: widget.username,
            ephone: widget.userphonenum,
            ecount: widget.complaintscount,
            ),
      ),
    );
  }

  void _signOut() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (builder) => Loginmain(),
      ),
    );
  }
}
