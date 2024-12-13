import 'package:flutter/material.dart';

class ComplaintsHistoryScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.purple,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () {},
        ),
        title: Text('History', style: TextStyle(color: Colors.white)),
      ),
      body: Column(
        children: [
          Container(
            color: Colors.purple,
            height: 100,
            child: Center(
              child: Text(
                '', // Decorative area for the top, can be customized.
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Text(
                      'List of All Complaints',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Expanded(
                    child: SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: DataTable(
                        columns: [
                          DataColumn(label: Text('S.No')),
                          DataColumn(label: Text('Statement')),
                          DataColumn(label: Text('Status')),
                          DataColumn(label: Text('View')),
                        ],
                        rows: [
                          DataRow(cells: [
                            DataCell(Text('1')),
                            DataCell(Text('Cleanliness')),
                            DataCell(Row(
                              children: [
                                Icon(Icons.circle, color: Colors.orange, size: 10),
                                SizedBox(width: 5),
                                Text('Pending'),
                              ],
                            )),
                            DataCell(ElevatedButton(
                              onPressed: () {},
                              style: ElevatedButton.styleFrom(backgroundColor: Colors.purple),
                              child: Text('View', style: TextStyle(color: Colors.white)),
                            )),
                          ]),
                          DataRow(cells: [
                            DataCell(Text('2')),
                            DataCell(Text('Cleanliness')),
                            DataCell(Row(
                              children: [
                                Icon(Icons.circle, color: Colors.red, size: 10),
                                SizedBox(width: 5),
                                Text('Rejected'),
                              ],
                            )),
                            DataCell(ElevatedButton(
                              onPressed: () {},
                              style: ElevatedButton.styleFrom(backgroundColor: Colors.purple),
                              child: Text('View', style: TextStyle(color: Colors.white)),
                            )),
                          ]),
                          DataRow(cells: [
                            DataCell(Text('3')),
                            DataCell(Text('Cleanliness')),
                            DataCell(Row(
                              children: [
                                Icon(Icons.circle, color: Colors.green, size: 10),
                                SizedBox(width: 5),
                                Text('Solved'),
                              ],
                            )),
                            DataCell(ElevatedButton(
                              onPressed: () {},
                              style: ElevatedButton.styleFrom(backgroundColor: Colors.purple),
                              child: Text('View', style: TextStyle(color: Colors.white)),
                            )),
                          ]),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}