// https://classic.wowhead.com/gear-planner/druid/night-elf
// TODO: Character selector
// TODO: level slider G.levels has 200 entries in it https://mui.com/material-ui/react-slider/
// TODO: gear selector
// TODO: Stats
// TODO: Attack table against specific mobs
// TODO: TrackTrix
// TODO: render item icon
// TODO: source - where does it drop?
// TODO: quality filter?
// TODO: tooltip on hover with item details https://mui.com/material-ui/react-tooltip/
// TODO: set items
// TODO: filter for properties? e.g. mluck
// TODO: clicking an item allows you to choose a different item
// TODO: there should be a tab where you can choose enchants, lvls and such?
// TODO: sharable links store state in url https://stackoverflow.com/a/41924535/28145
// https://medium.com/swlh/using-react-hooks-to-sync-your-component-state-with-the-url-query-string-81ccdfcb174f

import {
  Box,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  Modal,
  Paper,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  CharacterType,
  GItem,
  ItemInfo,
  ItemName,
  ItemType,
  SlotType,
  StatType,
} from "adventureland";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  CharacterTypeData,
  GDataContext,
  GItems,
  MainStatType,
} from "../GDataContext";
import { ItemImage } from "../ItemImage";
import { ItemTooltip } from "../ItemTooltip";
import { calculateItemStatsByLevel } from "../Utils";
import { GearSelectDialog, RowItem } from "./GearSelectDialog";
import { SelectedCharacterClass } from "./types";

// TODO: Defense table against specific mobs

export function GearPlanner() {
  const G = useContext(GDataContext);

  /**
   * EAR HAT EAR AMULET
   * MH CHEST OH CAPE
   * RING LEG RING ORB
   * BELT BOOTS HAND ELIXIR
   */

  // TODO: data for each gear slot with selected item, lvl, stats increases, and such.
  const [gear, setGear] = useState<{ [slot in SlotType]?: ItemInfo }>({});
  const [selectedGearSlot, setSelectedGearSlot] = useState<SlotType | false>(
    false
  );

  // TODO: what if you switch to a class that can not have the item selected equipped?
  const [selectedClass, setSelectedClass] = useState<SelectedCharacterClass>();

  const [level, setLevel] = useState(49); // TODO: find a sane default level

  if (!G) {
    return <>WAITING!</>;
  }

  const onShowAvailableGear = (slot: SlotType) => {
    setSelectedGearSlot(slot);
  };

  const onSelectGear = (slot: SlotType, row?: RowItem) => {
    console.log(slot, row);
    setSelectedGearSlot(false);
    if (!row) return;

    let equippedItem = gear[slot];
    if (!equippedItem) {
      gear[slot] = {
        name: row.itemName,
      };
    } else if (equippedItem.name !== row.itemName) {
      gear[slot] = {
        name: row.itemName,
      };
    }
  };

  const classes = G.classes
    ? Object.entries(G.classes).map(([className, item]) => {
        // item.mainhand seems to define valid mainhand types and their impact.
        // item.offhand does the same
        // item.doublehand defines twohanded weapons
        // then we have a bunch of stat attributes
        // resistance, frequency, mcourage, speed, armor, range, attack, hp, pcourage, mp_cost, courage, mp, output, main_stat
        // there is also .stats that contain dex,int,vit,str,for
        // .lstats I presume defines the gains per lvl
        return { className, ...item } as SelectedCharacterClass;
      })
    : [];

  const onLevelSliderChange = (event: Event, value: number | number[]) => {
    if (typeof value === "number") {
      setLevel(value);
    }
  };

  const onRemoveGear = (slot: SlotType) => {
    delete gear[slot];
  };

  return (
    <Container>
      <Grid container rowSpacing={1}>
        <Grid item xs={12}>
          {classes.map((c) => (
            <Chip
              label={c.className}
              variant={
                selectedClass && selectedClass.className === c.className
                  ? "filled"
                  : "outlined"
              }
              onClick={() => setSelectedClass(c)}
            />
          ))}
          <Slider
            aria-label="Level"
            // defaultValue={level}
            value={level}
            // getAriaValueText={() => level.toString()}
            // valueLabelDisplay="auto"
            valueLabelDisplay="on"
            step={1}
            marks
            min={1}
            max={200} // G.levels last entry.
            onChange={onLevelSliderChange}
          />
        </Grid>
        <Grid item xs={4}>
          <div>
            <div>
              <GearSlot onClick={onShowAvailableGear} slot="earring1" />
              <GearSlot onClick={onShowAvailableGear} slot="helmet" />
              <GearSlot onClick={onShowAvailableGear} slot="earring2" />
              <GearSlot onClick={onShowAvailableGear} slot="amulet" />
            </div>
            <div>
              <GearSlot onClick={onShowAvailableGear} slot="mainhand" />
              <GearSlot onClick={onShowAvailableGear} slot="chest" />
              <GearSlot onClick={onShowAvailableGear} slot="offhand" />
              <GearSlot onClick={onShowAvailableGear} slot="cape" />
            </div>
            <div>
              <GearSlot onClick={onShowAvailableGear} slot="ring1" />
              <GearSlot onClick={onShowAvailableGear} slot="pants" />
              <GearSlot onClick={onShowAvailableGear} slot="ring2" />
              <GearSlot onClick={onShowAvailableGear} slot="orb" />
            </div>
            <div>
              <GearSlot onClick={onShowAvailableGear} slot="belt" />
              <GearSlot onClick={onShowAvailableGear} slot="shoes" />
              <GearSlot onClick={onShowAvailableGear} slot="gloves" />
              <GearSlot onClick={onShowAvailableGear} slot="elixir" />
            </div>
          </div>
        </Grid>
        <Grid item xs={8}>
          <StatsPanel
            selectedCharacterClass={selectedClass}
            level={level}
            gear={gear}
          />
        </Grid>
        <Grid item xs={12}>
          <Table size="small" aria-label="a dense table">
            {Object.entries(gear).map(([slot, itemInfo]) => {
              if (!itemInfo) {
                return <></>;
              }
              const itemName = itemInfo.name;
              const gItem = G.items[itemName];
              return (
                <ItemTooltip itemName={itemName}>
                  <TableRow hover key={`list${slot}`}>
                    <TableCell width={25}>
                      <DeleteIcon
                        onClick={() => onRemoveGear(slot as SlotType)}
                      />
                    </TableCell>
                    <TableCell width={40}>
                      <ItemImage itemName={itemName} />
                    </TableCell>
                    <TableCell>{gItem.name}</TableCell>
                  </TableRow>
                </ItemTooltip>
              );
            })}
          </Table>
        </Grid>
      </Grid>
      {/* TODO: highlight / mark currently selected item? */}
      <GearSelectDialog
        slot={selectedGearSlot}
        items={G.items}
        onSelectGear={onSelectGear}
        selectedCharacterClass={selectedClass}
      />
    </Container>
  );
}

// https://mui.com/material-ui/react-modal/
export function GearSlot({
  slot,
  onClick,
}: {
  slot: SlotType;
  onClick: (slot: SlotType) => void;
}) {
  // TODO: valid type for mainhand depends on class and other things

  return (
    <>
      <div
        onClick={() => onClick(slot)}
        title={slot}
        style={{
          width: 50,
          height: 50,
          border: "1px solid black",
          display: "inline-block",
        }}
      ></div>
    </>
  );
}

// we need character class, level, gear
// buffs? mluck?
export function StatsPanel({
  selectedCharacterClass,
  level,
  gear,
}: {
  selectedCharacterClass?: SelectedCharacterClass;
  level: number;
  gear: { [slot in SlotType]?: ItemInfo };
}) {
  const G = useContext(GDataContext);
  if (!G) {
    return <></>;
  }

  // TODO: determine stats for character
  let stats: { [T in StatType]?: number } = {};
  // https://discord.com/channels/238332476743745536/238332476743745536/1008354654939263076
  // so it is probably 1*lstat to 40 and 3*lstat after
  const mainStatTypes: MainStatType[] = ["dex", "int", "vit", "str", "for"];
  // heal?
  const defenseStatTypes: StatType[] = ["resistance", "armor"];
  const offenseStatTypes: StatType[] = ["frequency", "attack"]; // is range offensive?
  const otherStatTypes: StatType[] = [
    "speed",
    "range",
    "mp_cost",
    "mp_reduction" /*, "goldm", "xpm", "luckm"*/,
  ];
  // "miss", "reflection", "lifesteal", "manasteal","rpiercing", "apiercing", "crit", "critdamage", "dreturn", "xrange"
  // "pnresistance", "fireresistance", "fzresistance", "stun", "blast", "explosion"
  // "courage", "mcourage", "pcourage", "fear", "pzazz"

  if (selectedCharacterClass) {
    stats = { ...stats, ...selectedCharacterClass };

    for (const stat of mainStatTypes) {
      stats[stat] = calculateMainStatByLevel(
        stat,
        level,
        selectedCharacterClass
      );
    }
  }

  for (const [slot, itemInfo] of Object.entries(gear)) {
    const itemName = itemInfo.name;
    const gItem = G.items[itemName];
    // TODO: what about special achievements on items?
    const itemStats = calculateItemStatsByLevel(gItem, itemInfo.level);
    Object.entries(itemStats).forEach(([key, value]) => {
      const stat = key as StatType;
      stats[stat] = (stats[stat] ?? 0) + value;
    });
  }

  Object.entries(stats)
    .filter(([stat, value]) => {
      return (
        !mainStatTypes.some((x) => x === stat) &&
        !defenseStatTypes.some((x) => x === stat) &&
        !offenseStatTypes.some((x) => x === stat) &&
        !otherStatTypes.some((x) => x === stat) &&
        stat !== "hp" &&
        stat !== "mp" &&
        stat !== "g" &&
        typeof value === "number"
      );
    })
    .forEach(([stat, value]) =>
      otherStatTypes.push(stat as unknown as StatType)
    );

  // TODO: str increases hp & armor
  // TODO: int increases mp & resistance
  // TODO: dex increases attack & run speed
  // TODO: vit increases hp proportional to level
  // TODO: mh, oh doublehand causes stat changes as well for the class.

  // TODO: apply gear stats
  // TODO: handle upgrades / compounding
  // TODO: render stats.
  // Pre lvl 60 chars have a newcomers buff as well.

  // stat
  // extra_stat
  return (
    <Grid container>
      <Grid item xs={3}>
        <Divider textAlign="left">GENERAL</Divider>
        <Table size="small" aria-label="a dense table">
          <TableRow>
            <TableCell>hp</TableCell>
            <TableCell align={"right"}>{stats.hp}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>mp</TableCell>
            <TableCell align={"right"}>{stats.mp}</TableCell>
          </TableRow>
          {mainStatTypes.map((stat) => (
            <TableRow>
              <TableCell
                key={`stat_${stat}`}
                style={{
                  fontWeight:
                    selectedCharacterClass?.main_stat === stat
                      ? "bold"
                      : "normal",
                }}
              >
                {stat}
              </TableCell>
              <TableCell align={"right"}>{stats[stat]}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Grid>
      <Grid item xs={3}>
        <Divider textAlign="left">OFFENSE</Divider>
        <Table size="small" aria-label="a dense table">
          {offenseStatTypes.map((stat) => (
            <TableRow>
              <TableCell key={`stat_${stat}`}>{stat}</TableCell>
              <TableCell align={"right"}>{stats[stat]}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Grid>
      <Grid item xs={3}>
        <Divider textAlign="left">DEFENSE</Divider>
        <Table size="small" aria-label="a dense table">
          {defenseStatTypes.map((stat) => (
            <TableRow>
              <TableCell key={`stat_${stat}`}>{stat}</TableCell>
              <TableCell align={"right"}>{stats[stat]}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Grid>
      <Grid item xs={3}>
        <Divider textAlign="left">OTHER</Divider>
        <Table size="small" aria-label="a dense table">
          {otherStatTypes.map((stat) => (
            <TableRow>
              <TableCell key={`stat_${stat}`}>{stat}</TableCell>
              <TableCell align={"right"}>{stats[stat]}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Grid>
    </Grid>
  );
}

const calculateMainStatByLevel = (
  stat: MainStatType,
  level: number,
  characterClass: SelectedCharacterClass
) => {
  const base = characterClass.stats[stat];
  const scaling = characterClass.lstats[stat];
  // TODO: need to investiage this formula.
  return (
    base +
    Math.min(level, 40) * scaling +
    (Math.max(40, level) - 40) * 3 * scaling
  );
  // return base + (level * scaling)
  // naked lvl 49 merchant returns str 6 dex 27 int 70 vit 15 for 0
  // Rising — Today at 22:33
  // merchants have 2 breakpoints, at lvl40 and lvl60
  // between 40-60 they get twice the scaling, from 60 onward 4 times the scaling
};

// Rising
// function stat_from_level(stat,lvl,ctype){
//   //Only for non merchant characters
//   const base = G.classes[ctype].stats[stat]
//   const scaling = G.classes[ctype].lstats[stat]
//   return base + Math.min(lvl,40)*scaling + (Math.max(40,lvl)-40)*3*scaling
// }
