import * as React from 'react';
import { StyletronComponent } from 'styletron-react';
import { Override } from '../overrides';

export interface TreeViewOverrides extends TreeLabelOverrides {
  Root?: Override<{}>;
  TreeItemList?: Override<{ $isChildNode?: boolean }>;
  TreeItem?: Override<{ $isLeafNode?: boolean }>;
  TreeLabel?: Override<TreeLabelProps>;
}

export interface TreeLabelOverrides {
  TreeItemContent?: Override<{}>;
  IconContainer?: Override<{}>;
  ExpandIcon?: Override<{}>;
  CollapseIcon?: Override<{}>;
  LeafIconContainer?: Override<{}>;
  LeafIcon?: Override<{}>;
}

export interface TreeNode<T = any> {
  id?: number | string;
  children?: TreeNode[];
  isExpanded?: boolean;
  label: ((node: TreeNode) => React.ReactNode) | string;
  info?: T;
  [key: string]: any;
}

export interface TreeLabelProps {
  hasChildren: boolean;
  isExpanded?: boolean;
  label: ((node: TreeNode) => React.ReactNode) | string;
  overrides?: TreeLabelOverrides;
  node: TreeNode;
}

export interface TreeNodeProps {
  node: TreeNode;
  onToggle?: (node: TreeNode) => void;
  overrides?: TreeViewOverrides;
  indentGuides?: boolean;
}

export type StatefulContainerProps = TreeViewProps & {
  children: (props: TreeViewProps) => React.ReactNode;
};

export interface TreeViewProps {
  data: TreeNode[];
  indentGuides?: boolean;
  onToggle?: (node: TreeNode) => void;
  overrides?: TreeViewOverrides;
  getId?: (node: TreeNode) => number | string;
  renderAll?: boolean;
  singleExpanded?: boolean;
}

export declare const TreeView: React.FC<TreeViewProps>;

export declare const StatefulTreeView: React.FC<TreeViewProps>;

export declare const TreeLabel: React.FC<TreeLabelProps>;

export declare const StyledTreeItemList: StyletronComponent<any, any>;
export declare const StyledTreeItem: StyletronComponent<any, any>;
export declare const StyledItemContent: StyletronComponent<any, any>;
export declare const StyledIconContainer: StyletronComponent<any, any>;

type TGetId = (node: TreeNode) => string | number;
type toggleIsExpandedT = (data: TreeNode[], toggledNode: TreeNode, getId?: TGetId) => TreeNode[];

export declare const toggleIsExpanded: toggleIsExpandedT;
export declare const TreeLabelInteractable: React.FC<{
  overrides?: { LabelInteractable: Override<any> };
  children?: React.ReactNode;
}>;
