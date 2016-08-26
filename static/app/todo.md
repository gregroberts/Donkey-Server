#TOFUCKINGDO


we made a right mess of the query page before. 

the key mistake was insanciating the subcomponents before fetching the details.
This means that 'new' states and load states resultin unexpected behaviour.

- instanciate everything at the start
- QueryEdit only holds meta details (grabber, handler, isNew, etc)
- subcomponents are responsible for their own data
- only at time of save does QueryEdit care about all the details


to recap, the state of the actual query is decided once in constructor.
then it's passed down to the sub components
at this point QueryEdit forgets about the query entirely
ITS A CONTAINER
so we wont need any shouldcomponentupdate functions!!!!!!
