import 'package:flutter/material.dart';

class Status extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
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
                top: 40,
                left: 20,
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () {
                        Navigator.of(context).pop();
                      },
                      child: Image.asset('assets/img/arrow2.png',height: 35,width: 43,),
                    ),
                    SizedBox(width: 10),
                    Text(
                      'Complaint Status',
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
          SizedBox(height: 20),
          // Header text
          Center(
            child: Text(
              'List of All Complaints',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
          ),
          SizedBox(height: 20),
          // Complaints Table
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Table(
                border: TableBorder.all(color: Colors.grey.shade300),
                columnWidths: const <int, TableColumnWidth>{
                  0: FixedColumnWidth(50),
                  1: FlexColumnWidth(),
                  2: FlexColumnWidth(),
                  3: FixedColumnWidth(80),
                },
                children: [
                  // Table Header
                  TableRow(
                    decoration: BoxDecoration(color: Colors.purple.shade100),
                    children: [
                      tableCell('S.No'),
                      tableCell('Statement'),
                      tableCell('Status'),
                      tableCell('View'),
                    ],
                  ),
                  // Complaint Rows
                  tableRow(1, 'Cleanliness', 'Pending', Colors.orange),
                  tableRow(2, 'Cleanliness', 'Rejected', Colors.red),
                  tableRow(3, 'Cleanliness', 'Solved', Colors.green),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  TableRow tableRow(
      int no, String statement, String status, Color statusColor) {
    return TableRow(
      children: [
        tableCell('$no'),
        tableCell(statement),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            children: [
              Icon(Icons.circle, color: statusColor, size: 12),
              SizedBox(width: 8),
              Text(status),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.purple,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
            onPressed: () {},
            child: Text('View'),
          ),
        ),
      ],
    );
  }

  Widget tableCell(String text) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Center(
        child: Text(
          text,
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
