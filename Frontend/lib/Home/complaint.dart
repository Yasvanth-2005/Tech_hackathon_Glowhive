import 'package:flutter/material.dart';
import 'package:girls_grivince/widgets/button.dart';

class Complaint extends StatefulWidget {
  @override
  _ComplaintState createState() => _ComplaintState();
}

class _ComplaintState extends State<Complaint> {
  String? selectedComplaintType;
  String? selectedComplaintCategory;
  String? selectedAdditionalType; // For the additional dropdown
  String? selectedCriticality;
  TextEditingController otherCategoryController = TextEditingController();

  final Map<String, List<String>> complaintCategories = {
    'Harassment': [
      'Verbal Abuse',
      'Sexual Harassment',
      'Bullying',
      'Stalking',
      'Cyber Harassment',
      'Discrimination',
      'Abuse of Authority by Staff or Faculty',
      'Others'
    ],
    'Personal': ['Hostel', 'Academics', 'FC', 'Others'],
    'General': ['Hostel', 'Academics', 'FC', 'Others'],
  };

  // Define the additional dropdown items based on category
  final Map<String, List<String>> additionalDropdownItems = {
    'Verbal Abuse': [
      'Intimidation,',
      'Demeaning language,',
      'Public humiliation',
      'Other'
    ],
    'Sexual Harassment': [
      'Unwanted Touching',
      'Explicit Comments',
      'Coercive requests for favors',
      'Other'
    ],
    'Bullying': [
      'Spreading rumors,',
      'Public embarrassment,',
      'Abuse of power',
      'Other'
    ],
    'Stalking': [
      'Monitoring movements',
      'Recording without consent',
      'Leaving unsolicited gifts',
      'Others'
    ],
    'Cyber Harassment': [
      'Excessive messaging',
      'Hacking accounts',
      'sharing inappropriate content',
      'Others'
    ],
    'Discrimination': [
      'Unequal academic opportunities',
      'Exclusion',
      'Religious barriers',
      'Others'
    ],
    'Abuse of Authority by Staff or Faculty': [
      'Unwelcome physical contact',
      'Favoritism',
      'Threats',
      'Others'
    ],
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          children: [
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
                  top: 40,
                  left: 20,
                  child: Row(
                    children: [
                      GestureDetector(
                        onTap: () => Navigator.pop(context), // Navigates back
                        child: Image.asset(
                          'assets/img/arrow2.png',
                          width: 41,
                          height: 33,
                        ),
                      ),
                      SizedBox(width: 12),
                      Text(
                        'Complaint Form',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.only(left: 20.0, right: 20, bottom: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Complaint Type
                  Text(
                    "Complaint Type:",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  SizedBox(height: 10),
                  _buildDropdownButton(
                    "Select Type",
                    ["Harassment", "Personal", "General"],
                    selectedComplaintType,
                    (value) {
                      setState(() {
                        selectedComplaintType = value;
                        selectedComplaintCategory = null; // Reset category
                        selectedAdditionalType =
                            null; // Reset additional dropdown
                      });
                    },
                  ),
                  SizedBox(height: 20),
                  // Complaint Category
                  Text(
                    "Complaint Category:",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  SizedBox(height: 10),
                  _buildDropdownButton(
                    "Select Category",
                    selectedComplaintType == null
                        ? []
                        : complaintCategories[selectedComplaintType]!,
                    selectedComplaintCategory,
                    (value) {
                      setState(() {
                        selectedComplaintCategory = value;
                        selectedAdditionalType =
                            null; // Reset additional dropdown when category changes
                      });
                    },
                  ),
                  SizedBox(height: 20),
                  // If "Others" is selected in category, show text field
                  if (selectedComplaintCategory == 'Others') ...[
                    _buildTextField("Specify Category",
                        controller: otherCategoryController),
                    SizedBox(height: 20),
                  ],
                  if (selectedComplaintType == 'Harassment' &&
                      selectedComplaintCategory != null) ...[
                    Text(
                      "${selectedComplaintCategory} Type:",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    SizedBox(height: 10),
                    _buildDropdownButton(
                      "${selectedComplaintCategory} Type",
                      additionalDropdownItems[selectedComplaintCategory] ?? [],
                      selectedAdditionalType,
                      (value) {
                        setState(() {
                          selectedAdditionalType = value;
                        });
                      },
                    ),
                    if (selectedAdditionalType == 'Others') ...[
                      _buildTextField(
                        "Specify ${selectedComplaintCategory} Type",
                        controller: otherCategoryController,
                      ),
                      SizedBox(height: 20),
                    ],
                    SizedBox(height: 20),
                  ],

                  // Statement
                  Text(
                    "Statement:",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  SizedBox(height: 10),
                  _buildTextField("Add Statement here..."),
                  SizedBox(height: 20),
                  // Additional fields for Harassment
                  if (selectedComplaintType == 'Harassment') ...[
                    _buildTextField("Time of Incident"),
                    SizedBox(height: 10),
                    _buildTextField("Location of Incident"),
                    SizedBox(height: 10),
                    _buildTextField("Harasser Details"),
                    SizedBox(height: 20),
                  ] else if (selectedComplaintType == 'Personal' ||
                      selectedComplaintType == 'General') ...[
                    _buildTextField("Victim Details"),
                    SizedBox(height: 20),
                  ],
                  // Description
                  Text(
                    "Description:",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  SizedBox(height: 10),
                  _buildTextField("Write a few lines...", maxLines: 5),
                  SizedBox(height: 20),
                  // Criticality
                  Text(
                    "Criticality:",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  SizedBox(height: 10),
                  _buildDropdownButton(
                    "Select Criticality",
                    ["High", "Medium", "Low"],
                    selectedCriticality,
                    (value) {
                      setState(() {
                        selectedCriticality = value;
                      });
                    },
                  ),
                  SizedBox(height: 40),
                  // Send Mail Button
                  Button(
                    text: "Send Mail",
                    function: () {
                      // Handle button action
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Helper to build dropdown buttons
  Widget _buildDropdownButton(
    String hint,
    List<String> items,
    String? selectedValue,
    ValueChanged<String?> onChanged,
  ) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 10),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.grey),
      ),
      child: DropdownButton<String>(
        isExpanded: true,
        value: selectedValue,
        underline: SizedBox(),
        hint: Text(hint),
        items: items.isEmpty
            ? []
            : items.map((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
        onChanged: onChanged,
      ),
    );
  }

  // Helper to build text fields
  Widget _buildTextField(String hint,
      {int maxLines = 1, TextEditingController? controller}) {
    return TextField(
      controller: controller,
      maxLines: maxLines,
      decoration: InputDecoration(
        hintText: hint,
        fillColor: Colors.grey[200],
        filled: true,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: Colors.grey),
        ),
      ),
    );
  }
}
