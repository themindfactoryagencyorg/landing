export function initTeamDisclosures(people, { media, location, onLayoutChange }) {
  const profiles = people.map((person) => ({
    person,
    button: person.querySelector(".person-toggle"),
    content: person.querySelector(".person-content"),
    expanded: false,
  }));

  function render(profile) {
    const expanded = !media.matches || profile.expanded;
    profile.button.disabled = !media.matches;
    profile.button.setAttribute("aria-expanded", String(expanded));
    profile.content.hidden = !expanded;
    profile.person.classList.toggle("is-expanded", media.matches && expanded);
  }

  function openLinkedProfile() {
    const linked = profiles.find(({ person }) => `#${person.id}` === location.hash);
    if (!linked) return;
    linked.expanded = true;
    render(linked);
  }

  profiles.forEach((profile) => {
    profile.button.addEventListener("click", () => {
      if (!media.matches) return;
      profile.expanded = !profile.expanded;
      render(profile);
      onLayoutChange();
    });
  });

  function syncLayout() {
    profiles.forEach(render);
    onLayoutChange();
  }

  openLinkedProfile();
  syncLayout();
  media.addEventListener("change", syncLayout);
  window.addEventListener("hashchange", () => {
    openLinkedProfile();
    onLayoutChange();
  });
  document.documentElement.classList.add("team-disclosures");
}
