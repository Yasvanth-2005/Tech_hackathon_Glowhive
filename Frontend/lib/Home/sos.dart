import 'package:flutter/material.dart';

class Sos extends StatefulWidget {
  @override
  _SosState createState() => _SosState();
}

class _SosState extends State<Sos> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: Duration(seconds: 2),
    )..repeat(reverse: false);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Purple container at the top
          Positioned(
            left: 0,
            right: 0,
            top: -20,
            child: Container(
              height: 200,
              decoration: BoxDecoration(
                color: Colors.purple,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(50),
                  bottomRight: Radius.circular(50),
                ),
              ),
            ),
          ),

          // Small container overlapping the purple container
          Positioned(
            left: 30,
            right: 30,
            top: 140,
            child: Container(
              height: 50,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.5),
                    blurRadius: 4,
                    spreadRadius: 2,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Center(
                child: Text(
                  'Girls Grievance',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.purple,
                  ),
                ),
              ),
            ),
          ),

          // SOS Button with wave animation at the center of the screen
          Center(
            child: Stack(
              alignment: Alignment.center,
              children: [
                AnimatedBuilder(
                  animation: _controller,
                  builder: (context, child) {
                    return Stack(
                      alignment: Alignment.center,
                      children: List.generate(4, (index) {
                        double size = 120.0 + (index * 20.0);
                        return Container(
                          height: size * _controller.value,
                          width: size * _controller.value,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.orangeAccent.withOpacity(
                                1 - _controller.value / (index + 1)),
                          ),
                        );
                      }),
                    );
                  },
                ),
                Container(
                  height: 120,
                  width: 120,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [Colors.yellow, Colors.orangeAccent],
                      center: Alignment.center,
                      radius: 0.8,
                    ),
                  ),
                ),
                Container(
                  height: 80,
                  width: 80,
                  decoration: BoxDecoration(
                    color: Colors.red,
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Text(
                      'SOS',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Four cards placed around the SOS button
          Positioned(
            top: MediaQuery.of(context).size.height * 0.5 - 140,
            left: 30,
            child: _buildGridItem(Icons.video_call, 'Video', Colors.blue),
          ),
          Positioned(
            top: MediaQuery.of(context).size.height * 0.5 - 140,
            right: 30,
            child: _buildGridItem(Icons.call, 'Fake Call', Colors.green),
          ),
          Positioned(
            bottom: MediaQuery.of(context).size.height * 0.5 - 140,
            left: 30,
            child: _buildGridItem(
                Icons.contact_emergency, 'SOS Contacts', Colors.purple),
          ),
          Positioned(
            bottom: MediaQuery.of(context).size.height * 0.5 - 140,
            right: 30,
            child: _buildGridItem(Icons.help, 'Help', Colors.orange),
          ),
        ],
      ),
    );
  }

  Widget _buildGridItem(IconData icon, String label, Color color) {
    return Container(
      height: 100,
      width: 100,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.5),
            blurRadius: 4,
            spreadRadius: 2,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 40, color: color),
          SizedBox(height: 8),
          Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}