import sys
import unittest
from unittest.mock import patch, MagicMock

# Mock out Flask dependencies which aren't present in this test environment
sys.modules['flask'] = MagicMock()
sys.modules['flask_socketio'] = MagicMock()

import server

class TestServer(unittest.TestCase):
    @patch('server.subprocess.run')
    @patch('builtins.print')
    def test_run_osascript_error_handling(self, mock_print, mock_subprocess_run):
        """
        Test that run_osascript catches and prints exceptions thrown by subprocess.run
        """
        # Arrange
        test_error_msg = "Test exception"
        mock_subprocess_run.side_effect = Exception(test_error_msg)
        test_script = "dummy script"

        # Act
        server.run_osascript(test_script)

        # Assert
        mock_subprocess_run.assert_called_once_with(["osascript", "-e", test_script], check=True)
        mock_print.assert_called_once_with(f"OSAScript Error: {test_error_msg}")

if __name__ == '__main__':
    unittest.main()
