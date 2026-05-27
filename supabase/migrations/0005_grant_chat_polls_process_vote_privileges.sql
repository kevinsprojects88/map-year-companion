grant select, insert on public.chat_messages to authenticated;

grant select, insert on public.story_polls to authenticated;
grant select, insert on public.story_poll_options to authenticated;
grant select, insert, update on public.story_poll_votes to authenticated;

grant select, insert, update on public.process_votes to authenticated;
grant select, insert, update on public.process_vote_responses to authenticated;
