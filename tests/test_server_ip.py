import unittest
from unittest.mock import patch, MagicMock
import socket
import sys
import os

# Add parent directory to sys.path to import server.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from server import get_local_ip

class TestServerIP(unittest.TestCase):
    @patch('socket.socket')
    def test_get_local_ip_success(self, mock_socket_class):
        # Create a mock socket instance
        mock_socket_instance = MagicMock()
        mock_socket_class.return_value = mock_socket_instance

        # Setup the mock return value for getsockname
        mock_socket_instance.getsockname.return_value = ('192.168.1.100', 12345)

        # Call the function
        ip = get_local_ip()

        # Assertions
        self.assertEqual(ip, '192.168.1.100')
        mock_socket_class.assert_called_once_with(socket.AF_INET, socket.SOCK_DGRAM)
        mock_socket_instance.connect.assert_called_once_with(('8.8.8.8', 1))
        mock_socket_instance.getsockname.assert_called_once()
        mock_socket_instance.close.assert_called_once()

    @patch('socket.socket')
    def test_get_local_ip_failure(self, mock_socket_class):
        # Create a mock socket instance
        mock_socket_instance = MagicMock()
        mock_socket_class.return_value = mock_socket_instance

        # Setup the mock to raise an exception when connect is called
        mock_socket_instance.connect.side_effect = Exception("Network unreachable")

        # Call the function
        ip = get_local_ip()

        # Assertions
        self.assertEqual(ip, '127.0.0.1')
        mock_socket_class.assert_called_once_with(socket.AF_INET, socket.SOCK_DGRAM)
        mock_socket_instance.connect.assert_called_once_with(('8.8.8.8', 1))
        # getsockname should not be called since connect failed
        mock_socket_instance.getsockname.assert_not_called()
        # close should still be called (in finally block)
        mock_socket_instance.close.assert_called_once()

if __name__ == '__main__':
    unittest.main()
