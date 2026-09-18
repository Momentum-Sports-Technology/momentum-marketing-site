import type { SpecFor } from "@/components/admin/form/spec";
import type { PlayersOfTheSeasonContent } from "@/lib/schemas";

export const playersOfTheSeasonSpec: SpecFor<PlayersOfTheSeasonContent> = {
  title: { kind: "text", label: "Page title" },
  intro: { kind: "textarea", rows: 3, label: "Intro" },
  tieBreaks: {
    kind: "list",
    label: "Tie breaks",
    itemName: "Tie break",
    itemLabel: (item) => `${String(item.division ?? "")} – ${String(item.name ?? "")}`,
    help: "Picks the winner when several players tie on Player of the Match awards in a division.",
    fields: {
      mstLeagueId: {
        kind: "text",
        label: "League number",
        help: "The number from the league's share link in Momentum Sports Technology.",
      },
      division: { kind: "text", label: "Division name" },
      name: { kind: "text", label: "Player name" },
      team: { kind: "text", label: "Team name" },
    },
  },
  divisions: {
    kind: "list",
    label: "Divisions",
    itemName: "Division",
    itemLabel: (item) => String(item.name ?? ""),
    fields: {
      name: { kind: "text", label: "Division name" },
      seasons: {
        kind: "list",
        label: "Seasons",
        itemName: "Season",
        itemLabel: (item) => String(item.name ?? ""),
        fields: {
          name: { kind: "text", label: "Season name" },
          players: {
            kind: "list",
            label: "Winners",
            itemName: "Player",
            itemLabel: (item) => String(item.name ?? ""),
            fields: {
              name: { kind: "text", label: "Name" },
              team: { kind: "text", label: "Team" },
            },
          },
        },
      },
    },
  },
};
