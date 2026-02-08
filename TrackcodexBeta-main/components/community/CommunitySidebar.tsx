
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CommunitySidebar = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const contributors = [
    { name: 'Marcus J.', reputation: '4.2k', avatar: 'https://picsum.photos/seed/m1/64' },
    { name: 'Elena R.', reputation: '3.8k', avatar: 'https://picsum.photos/seed/e1/64' },
    { name: 'James T.', reputation: '2.9k', avatar: 'https://picsum.photos/seed/j1/64' },
  ];

  const events = [
    { date: 'NOV 14', title: 'System Design Summit', subtitle: 'Virtual • 2pm EST' },
    { date: 'NOV 21', title: "Founder's AMA: Scaling", subtitle: 'Live Audio • 5pm EST' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Contributors */}
      <div className="p-6 bg-gh-bg-secondary border border-gh-border rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gh-text-secondary">Top Contributors</h3>
          <button className="text-[11px] font-bold text-primary hover:underline">View All</button>
        </div>
        <div className="space-y-5">
          {contributors.map(user => (
            <div key={user.name} className="flex items-center gap-3 group cursor-pointer" onClick={handleProfileClick}>
              <img src={user.avatar} alt={user.name} className="size-9 rounded-full border border-gh-border group-hover:border-primary transition-all" />
              <div>
                <p className="text-[13px] font-bold text-gh-text group-hover:text-primary transition-colors">{user.name}</p>
                <p className="text-[10px] text-gh-text-secondary font-medium">{user.reputation} reputation</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="p-6 bg-gh-bg-secondary border border-gh-border rounded-2xl">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gh-text-secondary mb-6">Upcoming Events</h3>
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.title} className="p-4 bg-gh-bg border border-gh-border rounded-xl flex items-center gap-4 group cursor-pointer hover:border-primary transition-all">
              <div className="size-12 bg-gh-bg-secondary border border-gh-border rounded-lg flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-black text-gh-text-secondary uppercase leading-none mb-1">{event.date.split(' ')[0]}</span>
                <span className="text-[15px] font-black text-gh-text leading-none">{event.date.split(' ')[1]}</span>
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-gh-text group-hover:text-primary transition-colors">{event.title}</h4>
                <p className="text-[10px] text-gh-text-secondary font-medium">{event.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Digest */}
      <div className="p-6 bg-gradient-to-br from-gh-bg-tertiary to-gh-bg border border-primary/20 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 text-primary mb-4">
          <span className="material-symbols-outlined text-[18px] filled">mail</span>
          <span className="text-[11px] font-black uppercase tracking-widest">Weekly Digest</span>
        </div>
        <p className="text-[12px] text-gh-text-secondary leading-relaxed mb-6 font-medium">Get the top engineering discussions delivered to your inbox every Monday.</p>
        <button className="w-full py-2.5 bg-primary hover:bg-white text-primary-foreground text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 transition-all">Subscribe</button>
      </div>
    </div>
  );
};

export default CommunitySidebar;
