//#include<iostream>
//using namespace std;
extern int n;
extern int s[100];
extern int rightn;
extern int rightans[100];
int spt[100];
int tpt[100];
int table[96];
int swpt[100];
int SEED;
int i;
int x,y;
int main()
{
	SEED=114514;
	for(i=0;i<96;i++)
		table[i]=i;
	for(i=1;i<96;i++)
	{
		SEED=(SEED*1919+7)%334363;
		x=SEED%i;
		y=table[x];
		table[x]=table[i];
		table[i]=y;
	}
	for(i=0;i<n;i++)
	{
		x=s[i]-32;
		if(x<0 || x>=96)	return -1;
		spt[i]=(table[x]+i)%96+32;
	}
	for(i=0;i<n;i++)
		swpt[i]=i;
	for(i=1;i<n;i++)
	{
		SEED=(SEED*1919+7)%334363;
		x=SEED%i;
		y=swpt[x];
		swpt[x]=swpt[i];
		swpt[i]=y;
	}
	for(i=0;i<n;i++)
		tpt[swpt[i]]=spt[i];
	if(n!=rightn)	return 0;
	for(i=0;i<n;i++)
		if(tpt[i]!=rightans[i])	return 0;
	return 1;
}
