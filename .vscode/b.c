#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    int priority;  
} Ticket;

typedef struct Node {
    Ticket t;
    int height;
    struct Node *left, *right;
} Node;

int height(Node *n) { return n ? n->height : 0; }
int max(int a, int b) { return (a > b) ? a : b; }


int compare(Ticket a, Ticket b) {
    if (a.priority != b.priority)
        return b.priority - a.priority;  
    return a.id - b.id;
}

Node* newNode(Ticket t) {
    Node n = (Node)malloc(sizeof(Node));
    n->t = t;
    n->height = 1;
    n->left = n->right = NULL;
    return n;
}

Node* rightRotate(Node *y) {
    Node *x = y->left;
    Node *T2 = x->right;

    x->right = y;
    y->left = T2;

    y->height = 1 + max(height(y->left), height(y->right));
    x->height = 1 + max(height(x->left), height(x->right));

    return x;
}

Node* leftRotate(Node *x) {
    Node *y = x->right;
    Node *T2 = y->left;

    y->left = x;
    x->right = T2;

    x->height = 1 + max(height(x->left), height(x->right));
    y->height = 1 + max(height(y->left), height(y->right));

    return y;
}

int getBalance(Node *n) {
    return n ? height(n->left) - height(n->right) : 0;
}


Node* insert(Node *root, Ticket t) {
    if (!root) return newNode(t);

    if (compare(t, root->t) < 0)
        root->left = insert(root->left, t);
    else if (compare(t, root->t) > 0)
        root->right = insert(root->right, t);
    else
        return root;   

    root->height = 1 + max(height(root->left), height(root->right));

    int balance = getBalance(root);


    if (balance > 1 && compare(t, root->left->t) < 0)
        return rightRotate(root);


    if (balance < -1 && compare(t, root->right->t) > 0)
        return leftRotate(root);

    
    if (balance > 1 && compare(t, root->left->t) > 0) {
        root->left = leftRotate(root->left);
        return rightRotate(root);
    }

    
    if (balance < -1 && compare(t, root->right->t) < 0) {
        root->right = rightRotate(root->right);
        return leftRotate(root);
    }

    return root;
}

void inorder(Node *root) {
    if (!root) return;
    inorder(root->left);
    printf("Ticket ID: %d   Priority: %d\n", root->t.id, root->t.priority);
    inorder(root->right);
}

Ticket make(int id, int p) {
    Ticket t;
    t.id = id;
    t.priority = p;
    return t;
}

int main() {
    Node *root = NULL;


    root = insert(root, make(1004, 3));  
    root = insert(root, make(1005, 2)); 

    root = insert(root, make(1001, 1));
    root = insert(root, make(1002, 3));
    root = insert(root, make(1003, 2));

    printf("Tickets sorted by priority:\n");
    inorder(root);

    return 0;
}
