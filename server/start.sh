#!/bin/bash
gunicorn -b 0.0.0.0:5000 -w 4 app:app
