from __future__ import unicode_literals

from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class userProfile(models.Model):
    user = models.OneToOneField(User, related_name='user')
    organization = models.CharField(max_length=100, default='')
