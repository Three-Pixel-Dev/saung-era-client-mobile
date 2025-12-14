import { colors } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";
import {constant} from "@/app/src/theme/constant";
export const theme = {
    colors,
    spacing,
    typography,
    constant
};

export type Theme = typeof theme;