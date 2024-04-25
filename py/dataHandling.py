"""
Script that handles data parsing and cleaning. Implemented to do aggregations on data in a simple manner using PANDAS.

Essentially, attempting to use pandas as a SQL alternative. 

"""
import pandas as pd
import numpy as np
from pandas.core.reshape.merge import merge
from pandas.core.groupby.grouper import get_grouper

constructor_standings = pd.read_csv("data/constructor_standings.csv")
constructors = pd.read_csv("data/constructors.csv")

# GROUP BY query on constructor ID in standings and constructors.csv
merged_data = pd.merge(constructor_standings, constructors, on='constructorId')

# SUM queries on constructor wins and points, GROUP BY constructor name
# constructor wins and points are the attributes we are interested in 
constructor_data = merged_data.groupby('name').agg({'points': 'sum', 'wins': 'sum'}).reset_index()

# TO REMOVE LATER:
#the statement above essentially implements these functions, but aggregates everything to one dataframe 
#allows for writing to CSV easily:
# constructor_points = merged_data.groupby('name')['points'].sum()
# constructor_wins = merged_data.groupby('name')['wins'].sum().reset_index()
# constructor_wins = constructor_wins.rename(columns={'wins': 'total_wins'})


# write data frame to a CSV, add it to data folder.
constructor_data.to_csv('data/constructor_data.csv', index=False) 


# print(constructor_data)

